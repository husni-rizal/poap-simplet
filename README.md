# Apillon prebuilt solution - Discord bot for token gating

This discord bot should allow you to give exclusive access to specific token / NFT holders, using Apillon platform and its developer tools.
It should allow you to:

Define which NFT collection someone should have to access the server,
Define the minimum free balance of a specific asset someone should have to access certain channels,
and other upcoming features!
Disclaimer: Use it at your own risk!

## Overview

Apillon prebuilt solutions are plug and play applications which can be deployed to production, with minimum modifications required.

This ready-made solution is designed to help you setup your own exclusive server to a targeted user (owner of an NFT collection, holder of an X token, etc.)

## Getting started

Solution consists of 2 main parts, Node.js backend APIs and Vue 3 frontend.

### Basic

If you have no experience with git and would still like to use our prebuilt solution, feel free to click the green button "Code" on the upper right corner of this repository and then selecting "Download ZIP".
Once downloaded, the zip file includes all files you need to run the application. Before that happens you need to set up configuration as described in documentation.

### Advanced

1. Fork the repo
2. Configure and modify APIs and website
3. Deploy API to docker or any other server that can run node.js applications
4. Deploy website to Apillon hosting

## Documentation

| Resource                       | Description              |
| ------------------------------ | ------------------------ |
| [Backend](backend/README.md)   | Docs for node.js backend |
| [Frontend](frontend/README.md) | Docs from Vue 3 frontend |

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
