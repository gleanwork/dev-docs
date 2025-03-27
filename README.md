# Glean Developer Documentation

This repository contains the source code for [developers.glean.com](https://developers.glean.com), Glean's platform developer documentation site. The documentation is built and hosted using [Mintlify](https://mintlify.com).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [pnpm](https://pnpm.io/) (recommended for package management)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/gleanwork/glean-developers-site.git
cd dev-docs
pnpm install
```

### Local Development

To start the development server:

```bash
pnpm dev
```

Once running, you can view the documentation at [http://localhost:3000](http://localhost:3000).

The Mintlify dev server supports hot reloading, so changes to the documentation files will be reflected immediately in the browser.

## Project Structure

The documentation site is organized as follows:

- Each documentation section is contained in its own root directory (e.g., `/indexing/`, `/client/`, `/web/`, `/actions/`) under `docs`
- Related assets such as images and styles should be included within the respective section's subdirectory, not in the root
- The root directory contains configuration files and shared resources
- `docs.json` - Mintlify configuration file that controls navigation and site settings

**Important**: Any new pages added to the documentation must be explicitly included in the `docs.json` file for them to appear in the navigation.

## Documentation Format

All documentation is written in MDX (Markdown with JSX) which allows for embedding React components within Markdown content. Files use the `.mdx` extension.

## Configuration

The `docs.json` file is the main configuration file for the Mintlify documentation site. It defines:

- Site theme and colors
- Navigation structure
- Page grouping
- Site metadata

## Contributing

Contributions to improve the documentation are always welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute.

### Reporting Issues

If you find any bugs or have feature requests, please create an issue in the [gleanwork/glean-developers-site](https://github.com/gleanwork/glean-developers-site) repository.

### Pull Requests

We welcome pull requests for documentation improvements:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-improvement`)
3. Commit your changes (`git commit -m 'Add some amazing improvement'`)
4. Push to the branch (`git push origin feature/amazing-improvement`)
5. Open a Pull Request

## Deployment

The documentation site is automatically deployed when changes are merged into the main branch. The deployment process is handled by Mintlify's hosting service.

## License

Copyright Glean Technologies, Inc. All rights reserved.
