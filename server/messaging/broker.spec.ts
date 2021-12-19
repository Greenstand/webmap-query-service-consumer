import * as Rascal from 'rascal'

const config: Rascal.BrokerConfig = {
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
  let broker: Rascal.Broker

  function testPublish() {
    broker.publish(
      'test_pub',
      'Hello Test',
      'a.b.c',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function (err, _publication) {
        expect(err).toBeFalsy()
      },
    )
  }

  beforeAll(function (done) {
    Rascal.Broker.create(config, (err, _broker) => {
      if (err) return done(err)
      broker = _broker
      done()
    })
  })

  beforeEach(function (done) {
    broker.purge(done)
  })

  afterAll(function (done) {
    if (!broker) return done()
    broker.nuke(done)
  })

  it('should demonstrate tests', function (done) {
    broker.subscribe('demo_sub', function (err, subscription) {
      expect(err).toBeFalsy()
      subscription.on('message', function (message, content, ackOrNack) {
        subscription.cancel(() => {})
        ackOrNack()
        done()
      })
    })

    testPublish()
  })

  it('should handle async subscription', function (done) {
    broker.subscribe('demo_sub', function (err, subscription) {
      expect(err).toBeFalsy()
      subscription.on('message', async function (message, content, ackOrNack) {
        await new Promise((r) => setTimeout(() => r(''), 10))
        subscription.cancel(() => {})
        ackOrNack()
        done()
      })
    })

    testPublish()
  })

  it('should handle error', function (done) {
    let attempts = 0
    broker.subscribe('demo_sub', {}, function (err, subscription) {
      expect(err).toBeFalsy()
      subscription.on('message', async function (message, content, ackOrNack) {
        try {
          console.log('attempts:', attempts)
          await new Promise((r) => setTimeout(() => r(''), 100))
          if (!attempts) {
            attempts++
            throw new Error('error')
          }
          subscription.cancel(() => {})
          ackOrNack()
          done()
        } catch (error) {
          console.log('received error', error)
          ackOrNack(error as Error, {
            strategy: 'nack',
            requeue: true,
          })
        }
      })
    })

    testPublish()
  })
})
