> A NX plugin for developing azure functions

## Install

```
npm install nx-azure-function
```

## Generators

Initialize a nx application as a azure function app

```
nx generate nx-azure-function:init --projectName={project name}

nx generate nx-azure-function:init --projectName=fn
```

Create a function in a function app

```
nx generate nx-azure-function:function --functionName={function name} --projectName={project name}

nx generate nx-azure-function:function --functionName=hello-world --projectName=fn
```

## Executors

Serves a function app locally, also added with nx-azure-function:init generator

```
nx-azure-function:serve

nx run {project name}:serve
```

## License

[MIT](https://github.com/egorderg/nx-azure-function/blob/main/LICENSE)
