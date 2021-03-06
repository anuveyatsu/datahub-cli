const test = require('ava')
const {
  normalizeAll, normalizeLicenses
} = require('../lib/normalize.js')
const {runcli} = require('./cli.test.js')

const dp = {
  name: 'example',
  author: 'Mikane',
  license: {
    name: 'example_license',
    url: 'https://example/license.com'
  },
  resources: [
    {
      url: 'https://raw.github.com/datasets/dp/ppp-gdp.csv',
      path: 'dp/ppp-gdp.csv',
      format: 'csv',
      mediatype: 'text/csv',
      schema: {
        fields: [
          {
            name: 'Country',
            type: 'string'
          },
          {
            name: 'Country ID',
            type: 'decimal',
            description: 'ISO 3166-1 alpha-2 code'
          },
          {
            name: 'Year',
            type: 'date',
            format: 'YYYY',
            description: 'Relevant year'
          }
        ]}
    }
  ],
  sources: [
    {
      name: 'source-name',
      web: 'https://example/source.com'
    }
  ],
  contributors: [
    {
      name: 'contributor-name'
    },
    {
      email: 'test@gmail.com'
    }
  ]
}

test('checks normalized all properties', t => {
  const res = normalizeAll(dp)
  const exp = {
    name: 'example',
    licenses: [{
      name: 'example_license',
      url: 'https://example/license.com'
    }],
    resources: [
      {
        name: 'ppp-gdp',
        path: 'dp/ppp-gdp.csv',
        format: 'csv',
        mediatype: 'text/csv',
        schema: {
          fields: [
            {
              name: 'Country',
              type: 'string'
            },
            {
              name: 'Country ID',
              type: 'number',
              description: 'ISO 3166-1 alpha-2 code'
            },
            {
              name: 'Year',
              type: 'date',
              format: 'any',
              description: 'Relevant year'
            }
          ]}
      }
    ],
    sources: [
      {
        title: 'source-name',
        name: 'source-name',
        path: 'https://example/source.com'
      }
    ],
    contributors: [
      {
        name: 'contributor-name',
        title: 'contributor-name'
      },
      {
        email: 'test@gmail.com',
        title: ''
      },
      {
        title: 'Mikane'
      }
    ]
  }
  t.deepEqual(res, exp)
})

test('normalizeLicenses function', t => {
  let dp = {
    license: 'PDDL-1.0'
  }
  let res = normalizeLicenses(dp)
  const exp = {
    licenses: [{
      name: 'PDDL-1.0'
    }]
  }
  t.deepEqual(res, exp)
  dp = {
    license: {name: 'PDDL-1.0'}
  }
  t.deepEqual(res, exp)
})

test.skip('"data norm[alize] test/fixtures/datapackage.json" normalizes datapackage.json with given file path', async t => {
  const result = await runcli('normalize', 'test/fixtures/datapackage.json')

  t.is(result.code, 0)
  const stdout = result.stdout.split('\n')
  t.true(stdout.length > 1)
  t.true(stdout[0].includes('Datapackage.json has been normalized'))
})

test.skip('"data norm[alize] test/fixtures" normalizes datapackage.json inside given folder', async t => {
  const result = await runcli('normalize', 'test/fixtures')

  t.is(result.code, 0)
  const stdout = result.stdout.split('\n')
  t.true(stdout.length > 1)
  t.true(stdout[0].includes('Datapackage.json has been normalized'))
})
