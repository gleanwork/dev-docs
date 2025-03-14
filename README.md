# Glean Help Center

> [!NOTE]
> This project is currently in preview.

Glean Help Center & Public Documentation Portal.

Core pillars:
- Speed and UX
- Single source of truth for Glean customers
- Easy to contribute to for all Glean departments (Eng, Marketing, Support, etc)
- Easy to integrate into Glean products (e.g. Connector setup instructions in the Glean UI)

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where mint.json is)

```
mintlify dev --port 8888
```