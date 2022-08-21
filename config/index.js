const dev = process.env.NODE_ENV !== "production";

export const myServer = dev
    ? ""
    : "/pull_request_preview";

// export const imgs = `${server}/imgs`;
