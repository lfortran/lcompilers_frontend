## Getting Started

First install `npm` for example using Conda:
```
conda env create -f environment.yml
conda activate npm
```
Install dependencies:
```
npm install
```

Then build the website:
```
./build.py
```

Finally serve a local version using:
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Features

### Loading Source Code from Gist or URL

This feature allows users to load source code into the text box by providing either a URL or a GitHub Gist. It simplifies the process of compiling and running code from external sources, making it convenient for users to test and share code effortlessly.

#### Loading Source Code from URL

- Users can load source code by providing a URL directly in the format: `https://dev.lfortran.org/?code=<URL-encoded code>`.
- The code provided via URL can be any valid Fortran code.

##### Example URL:
```
https://dev.lfortran.org/?code=program%20hello%0A%20%20!%20This%20is%20a%20comment%20line%3B%20it%20is%20ignored%20by%20the%20compiler%0A%20%20print%20*%2C%20%27Hello%2C%20World!%27%0Aend%20program%20hello%0A
```

#### Loading Source Code from GitHub Gist

- Alternatively, users can load source code from a GitHub Gist by providing the Gist URL in the format: `https://dev.lfortran.org/?gist=<GitHub username>/<Gist ID>`.
- The compiler will fetch the raw content from the specified GitHub Gist.
- **Note:** GitHub Gist takes approximately 5 minutes to update the raw content after any changes are made. As a result, there may be a delay of about 5 minutes before the updated content is reflected when loaded.

##### Example GitHub Gist URL:
```
https://dev.lfortran.org/?gist=certik/7e2652943bbff7f0d0963dd4fcf1813a
```

#### Mutual Exclusivity

- Users should be aware that if both a URL and a GitHub Gist are provided, the `code` parameter is given preference. Only the code provided via the `code` parameter will be considered for compilation.

This feature enhances the versatility of the LFortran compiler, enabling users to seamlessly compile and run Fortran code from external sources without needing to download or manage local files.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
