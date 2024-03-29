/* eslint-env mocha */

'use strict'

const tymly = require('@wmfs/tymly')
const path = require('path')
const expect = require('chai').expect
const process = require('process')

describe('data import', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  const STATE_MACHINE_NAME = 'wmfs_refreshFromCsvFile_1_0'

  let tymlyService
  let statebox
  let client

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  it('startup tymly', async () => {
    const tymlyServices = await tymly.boot(
      {
        pluginPaths: [
          require.resolve('@wmfs/tymly-pg-plugin'),
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './../'),
          require.resolve('@wmfs/tymly-test-helpers/blueprints/mock-gazetteer-property-blueprint')
        ],
        config: {}
      }
    )

    tymlyService = tymlyServices.tymly
    statebox = tymlyServices.statebox
    client = tymlyServices.storage.client
  })

  it('create and populate the wmfs.building table', async () => {
    const executionDescription = await statebox.startExecution(
      {
        sourceDir: path.resolve(__dirname, './fixtures/input')
      }, // input
      STATE_MACHINE_NAME, // state machine name
      {
        sendResponse: 'COMPLETE'
      } // options
    )

    expect(executionDescription.status).to.eql('SUCCEEDED')
    expect(executionDescription.currentStateName).to.eql('ImportingCsvFiles')
  })

  it('verify data in the table', async () => {
    const result = await client.query(
      'select uprn, footprint, height, sprinkler_coverage from wmfs.building order by uprn'
    )

    expect(result.rows).to.eql(
      [
        {
          footprint: '700.00',
          height: '5.00',
          sprinkler_coverage: '100',
          uprn: '1234567890'
        },
        {
          footprint: '1500.00',
          height: '7.00',
          sprinkler_coverage: '75',
          uprn: '1234567891'
        },
        {
          footprint: '120.00',
          height: '6.00',
          sprinkler_coverage: '40',
          uprn: '1234567892'
        },
        {
          footprint: '1000.00',
          height: '24.00',
          sprinkler_coverage: '100',
          uprn: '1234567893'
        },
        {
          footprint: '1750.00',
          height: '60.00',
          sprinkler_coverage: '50',
          uprn: '1234567894'
        },
        {
          footprint: '12500.00',
          height: '48.00',
          sprinkler_coverage: '60',
          uprn: '1234567895'
        },
        {
          footprint: '350.00',
          height: '10.00',
          sprinkler_coverage: '100',
          uprn: '1234567896'
        }
      ]
    )
  })

  it('clean up the table', async () => {
    const result = await client.query(
      'DELETE FROM wmfs.building WHERE uprn::text LIKE \'123456789%\';'
    )

    expect(result.rowCount).to.eql(7)
  })

  it('verify empty table', async () => {
    const result = await client.query(
      'select * from wmfs.building;'
    )

    expect(result.rows).to.eql([])
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
