#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const server = new Server(
  {
    name: 'playwright-ai-agent-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'run_playwright_test',
        description: 'Run a specific Playwright test file',
        inputSchema: {
          type: 'object',
          properties: {
            testFile: {
              type: 'string',
              description: 'Path to the test file to run',
            },
            project: {
              type: 'string',
              description: 'Browser project to use (e.g., chromium, firefox)',
            },
            headed: {
              type: 'boolean',
              description: 'Run in headed mode',
              default: false,
            },
          },
          required: ['testFile'],
        },
      },
      {
        name: 'run_all_tests',
        description: 'Run all Playwright tests',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_test_report',
        description: 'Get the latest test report',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'run_playwright_test') {
      const { testFile, project, headed } = args as any;
      let cmd = `npx playwright test ${testFile}`;
      if (project) cmd += ` --project=${project}`;
      if (headed) cmd += ' --headed';
      
      const { stdout, stderr } = await execAsync(cmd);
      return {
        content: [
          {
            type: 'text',
            text: `Test run output:\n${stdout}\n${stderr ? `Errors:\n${stderr}` : ''}`,
          },
        ],
      };
    }

    if (name === 'run_all_tests') {
      const { stdout, stderr } = await execAsync('npx playwright test');
      return {
        content: [
          {
            type: 'text',
            text: `All tests output:\n${stdout}\n${stderr ? `Errors:\n${stderr}` : ''}`,
          },
        ],
      };
    }

    if (name === 'get_test_report') {
      const { stdout } = await execAsync('ls -la playwright-report/ || echo "No report found"');
      return {
        content: [
          {
            type: 'text',
            text: `Test report:\n${stdout}`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${(error as Error).message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Playwright AI Agent MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
