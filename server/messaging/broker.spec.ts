import { BrokerAsPromised, BrokerConfig, withTestConfig } from 'rascal'

import { initBroker, subscribe } from './broker'

const config: BrokerConfig = {
  vhosts: {
    v1: {
      connection: {
        url: process.env.RABBITMQ_URL,
      },
      exchanges: ['demo_ex'],
      queues: ['demo_q'],
      bindings: ['demo_ex[a.b.c] -> demo_q'],
      publications: {
        demo_pub: {
          exchange: 'demo_ex',
          routingKey: 'a.b.c',
        },
        test_pub: {
          exchange: 'demo_ex',
        },
      },
      subscriptions: {
        demo_sub: {
          queue: 'demo_q',
        },
      },
    },
  },
}

describe('Example rascal test', function () {
  let broker: BrokerAsPromised

  function testPublish() {
    return broker.publish('test_pub', 'Hello Test', 'a.b.c')
  }

  beforeAll(async () => {
    broker = await initBroker(withTestConfig(config))
  })

  beforeEach(async () => {
    await broker.purge()
  })

  afterEach(async () => {
    await broker.unsubscribeAll()
  })

  afterAll(async () => {
    await broker.nuke()
  })

  it('should demonstrate tests', async () => {
    await subscribe(broker, 'demo_sub', async () => {})
    await testPublish()
  })

  it('should handle async subscription', async () => {
    const subscription = await broker.subscribe('demo_sub')
    subscription.on('message', async function (message, content, ackOrNack) {
      await new Promise((r) => setTimeout(() => r(''), 10))
      ackOrNack()
    })
    await testPublish()
  })

  it('should handle error', async () => {
    let attempts = 0
    const subscription = await broker.subscribe('demo_sub', {})
    subscription.on('message', async function (message, content, ackOrNack) {
      try {
        console.log('attempts:', attempts)
        await new Promise((r) => setTimeout(() => r(''), 100))
        if (!attempts) {
          attempts++
          throw new Error('error')
        }
        ackOrNack()
        expect(attempts).toEqual(1)
      } catch (error) {
        console.log('received error', error)
        ackOrNack(error as Error, {
          strategy: 'nack',
          requeue: true,
        })
      }
    })
    await testPublish()
  })
})
