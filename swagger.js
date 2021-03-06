export default {
  swagger: '2.0',
  info: {
    description: 'Developer exercise of TUI Stay, eCommerce squad',
    version: '1.0.0',
    title: 'TUI Test',
    contact: {
      email: 'jonatancolussi81@gmail.com'
    }
  },
  host: 'tui-test.herokuapp.com',
  tags: [
    {
      name: 'hotels',
      description: 'Hotels routes'
    }
  ],
  schemes: [
    'https'
  ],
  paths: {
    '/hotels': {
      post: {
        tags: [
          'hotels'
        ],
        summary: 'Get data of Amadeus and insert in database',
        consumes: [
          'application/json'
        ],
        produces: [
          'application/json'
        ],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: '',
            required: true,
            schema: {
              $ref: '#/definitions/AddHotel'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#/definitions/AddHotelResponse'
            }
          },
          400: {
            description: 'Invalid payload'
          },
          500: {
            description: 'Internal server Error'
          }
        }
      },
      get: {
        tags: [
          'hotels'
        ],
        summary: 'List data of database',
        produces: [
          'application/json'
        ],
        parameters: [
          {
            in: 'query',
            type: 'string',
            name: 'name',
            description: 'filter by name',
            required: false
          },
          {
            in: 'query',
            type: 'string',
            name: 'cityCode',
            description: 'filter by cityCode',
            required: false
          },
          {
            in: 'query',
            type: 'number',
            name: 'priceStart',
            description: 'filter by priceStart',
            required: false
          },
          {
            in: 'query',
            type: 'number',
            name: 'priceEnd',
            description: 'filter by priceEnd',
            required: false
          }
        ],
        responses: {
          200: {
            description: 'List of hotels'
          },
          400: {
            description: 'Invalid payload'
          },
          500: {
            description: 'Internal server Error'
          }
        }
      }
    }
  },
  definitions: {
    AddHotel: {
      type: 'object',
      required: [
        'cityCodes'
      ],
      properties: {
        cityCodes: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
    AddHotelResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  }
}
