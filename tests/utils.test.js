import './setup.js'
import { isItStillCompiling } from '../assets/scripts/utils.js'

describe('Utils function', () => {
  let now, clock

  beforeEach(() => {
    now = new Date('2024-12-03 10:00')
    clock = sinon.useFakeTimers(now.getTime())
  })

  afterEach(() => {
    clock.restore()
  })

  describe('#isItStillCompiling', () => {
    it('returns true when just commited', () => {
      const lastCommit = {
        committer: {
          timestamp: now.getTime() / 1000,
        },
      }

      expect(isItStillCompiling(lastCommit)).to.be.true
    })

    it('returns true when commited since less than DELAY', () => {
      const commitDatetime = new Date('2024-12-03 10:29')
      const lastCommit = {
        committer: {
          timestamp: commitDatetime.getTime() / 1000,
        },
      }

      expect(isItStillCompiling(lastCommit)).to.be.true
    })

    it('returns false when commited since more than DELAY', () => {
      const commitDatetime = new Date('2024-12-02 15:30')
      const lastCommit = {
        committer: {
          timestamp: commitDatetime.getTime() / 1000,
        },
      }

      expect(isItStillCompiling(lastCommit)).to.be.false
    })
  })
})
