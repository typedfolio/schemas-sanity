# Sanity implementation

Implementation of the Typedfolio schemas for Sanity.

## Basic instructions

**FIXME**: To be updated and documented properly.

Install and use `nvm` to manage Node versions. Install and use Node 20.10.0 LTS.

Get the dependencies by running the following.

```
npm install
```

Create a separate temporary directory, such as `~/tmp`. Inside that directory, run the following.

```
npm create sanity@latest
```

Unless you are adding to an existing project (highly discouraged), select "Create new project" in the _Select project to use_ prompt and enter a name for the project, e.g., "Typedfolio".

```
✔ Fetching existing projects
? Select project to use
❯ Create new project
```

For the rest of the prompts, use the default configurations except in the _Select project template prompt_ as shown below, choose "Clean project with no predefined schemas".

```
? Select project template
  Movie project (schema + sample data)
  E-commerce (Shopify)
  Blog (schema)
❯ Clean project with no predefined schemas
```

Select `npm` as the _Package manager to use for installing dependencies?_ prompt for simplicity but you can use other package managers if you know what you are doing.

```
? Package manager to use for installing dependencies?
❯ npm
  yarn
  manual
```

This will create an empty Sanity project and initialise it as a Git repository in the path you chose during the Sanity installations. In that directory, run `cat sanity.config.ts | grep projectId` and you will get an output such as `projectId: '8d32xks7',`. Replace `<INSERT-SANITY-PROJECT-ID>` by this project ID on the line `export const projectId = "<INSERT-SANITY-PROJECT-ID>"` in the file `./lib/sanity.api.ts` in directory where you cloned this schema project (NOT the temporary directory that you just created).

Note that you can also find this project ID by browsing to [https://manage.sanity.io](https://manage.sanity.io) and selecting your newly created project.

Remove the temporary directory where you created the Sanity project.

Switch to the directory where you cloned this schema project. Run `npm run dev` and open [http://localhost:3333](http://localhost:3333) on your browser. For the first time, it will ask you to login to Sanity. Once you are done, you will be presented with the Sanity Studio user interface that will let you create data adhering to the described data model. You can start by creating a new "Profile". **FIXME**: Notice that internationalisation support has not been built or tested properly. **FIXME**: Similarly, the "Research publication" schema is temporary and will change.

**DO NOT FORGET** to "Publish" everything that you create.

Once you are satisfied with creating your data, go back to the terminal and stop the local Sanity studio server that you run using `npm run dev`. In order to have an externally accessible deployment of Sanity Studio (this is not necessary), run `npx sanity deploy`. Choose the favoured hostname for the Studio at the _Studio hostname_ prompt as shown below.

```
✔ Checking project info
Your project has not been assigned a studio hostname.
To deploy your Sanity Studio to our hosted Sanity.Studio service,
you will need one. Please enter the part you want to use.
? Studio hostname (<value>.sanity.studio): typedfolio
```

Once deployed, the studio will be accessible at [https://yourstudio.sanity.studio](https://yourstudio.sanity.studio), for example: [https://typedfolio.sanity.studio](https://typedfolio.sanity.studio). You can undeploy your externally available studio anytime using `npx sanity undeploy` but do remember that the sub-domain under `sanity.studio` top-level domain will be freed up for anyone else to use.
