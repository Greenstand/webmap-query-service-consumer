import * as Rascal from 'rascal'

describe('Example rascal test', function () {
  let broker: Rascal.Broker

  beforeAll(function (done) {
    const config: any = {
      vhosts: {
        '/': {
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

    Rascal.Broker.create(config, function (err, _broker) {
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

    broker.publish(
      'test_pub',
      'Hello Test',
      'a.b.c',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function (err, _publication) {
        expect(err).toBeFalsy()
      },
    )
  })
})
