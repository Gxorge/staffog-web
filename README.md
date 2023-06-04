# Staff-OG Web
This contains the following websites:
- Staff panel
- Public Appeals
- Public Reports
<br>
These all link up to the [Staff-OG](https://github.com/Gxorge/Staff-OG) plugin.

## Setup
- Enter the directory of the website you want to setup.
- Install node dependencies by running `npm install`.
- Build the project via `npm run build`.
- Copy `package.json`, `package-lock.json` and `.example.env` to `build`.
- Run `npm ci --omit dev`.
- Rename `.example.env` to `.env` and change the variables as needed.
- Start node with `node .`. Use your favourite node manager for best results, i.e. pm2.
