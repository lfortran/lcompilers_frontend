const dev = process.env.NODE_ENV !== "production";

export const myServer = dev
    ? ""
    : "/lcompilers_frontend";

// export const imgs = `${server}/imgs`;
