import * as ws from 'ws';
import { faker } from '@faker-js/faker';
const server = new ws.Server({ port: 8080 });
let currLatLong : number[] = [-74.006, 40.7128]

server.on('connection', (socket) => {
    setInterval(() => {
        currLatLong = faker.address.nearbyGPSCoordinate([currLatLong[0], currLatLong[1]], 12).map(Number)
        socket.send(JSON.stringify({
            point: currLatLong,
            altitude: faker.datatype.number({max: 1200, min: 1000 }),
            voltage: faker.datatype.number({max: 25, min: 24, precision: 0.01  }),
            speed: faker.datatype.number({max: 35, min: 25, precision: 0.01  }),
            heading: faker.datatype.number({max: 360, min: 0, precision: 0.01  }),
        }))    
    }, 200)
    
});