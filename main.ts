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
        return {
            content: [
                {
                    type: 'text',
                    text: `El clima de ${city} es soleado`
                }
            ]
        }
    }
)

const transport = new StdioServerTransport()
await server.connect(transport)