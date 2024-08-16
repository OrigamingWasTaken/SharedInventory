# SharedInventory
This is a datapack that shares your inventory between team members.

To join a team, run `/trigger join.<team name>`

To start, run `/function si:start`

To stop, run `/function si:stop`


[//]: # "If .disable is removed from .github/workflows/packbuild.yml.disable & the repo is published to GitHub."
Generated pack is in `generated` branch.

To build the packs, run:
```ts
npm run build
// or
yarn build
// or
sand build
```

To automatically rebuild the packs on each change, run:
```ts
npm run watch
// or
yarn watch
// or
sand watch
```
