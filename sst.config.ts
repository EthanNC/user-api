import { SSTConfig } from "sst";
import { Service } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "user-api",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function API({ stack }) {
      const service = new Service(stack, "service", {
        port: 3000,
      });

      stack.addOutputs({
        ServiceUrl: service.url,
      });
    });
  },
} satisfies SSTConfig;
