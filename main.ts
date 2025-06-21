import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio";

const server = new McpServer({
    name: 'Demo',
    version: '0.0.1',
})

server.tool('fetch-weather', 'Tool to fetch the weather',
    {
        city: z.string().describe('City name'),
    },
    async ({city}) => {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json`)
        const data = await response.json();
        if (data.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'City not found'
                    }
                ]
            }
        }

        const {latitude, longitude} = data.results[0];
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,precipitation,is_day,rain&forecast_days=1`)
        const weatherData = await weatherResponse.json();

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(weatherData),
                }
            ]
        }
    }
)

const transport = new StdioServerTransport()
await server.connect(transport)