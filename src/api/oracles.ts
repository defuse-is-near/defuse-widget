import axios from "axios"

export const getSolverTokenFormat = (token: string) =>
  axios
    .post("https://solver-relay.chaindefuser.com/rpc", {
      id: 1,
      jsonrpc: "2.0",
      method: "discover_defuse_assets",
      params: [token],
    })
    .then((resp) => resp.data)
