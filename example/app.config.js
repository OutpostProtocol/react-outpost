import "dotenv/config";

export default {
  name: 'Outpost',
  version: '1.0.0',
  extra: {
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  },
};
