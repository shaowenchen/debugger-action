# Debugger Action

Two types of proxies are supported:

- ngrok
- frp

## How to use by Ngork

### Prerequisites

- A [Ngrok Authtoken](https://dashboard.ngrok.com/auth/your-authtoken)

### Usage

1. Set up your `Ngrok Authtoken` as secrets in your repository settings using `NGROK_TOKEN` .

2. Add the following to your workflow

```yml
- uses: shaowenchen/debugger-action@v2
  name: debugger
  timeout-minutes: 30
  continue-on-error: true
  with:
    ngrok_token: ${{ secrets.NGROK_TOKEN }}
```

3. Run your workflow and login the runner

In the log of GitHub Actions, find **localhost:8000** and you can see that:

```txt
t=2021-01-19T03:57:10+0000 lvl=info msg="started tunnel" obj=tunnels name=command_line addr=//localhost:8000 url=tcp://2.tcp.ngrok.io:16400
```

```bash
ssh root@2.tcp.ngrok.io -p 16400
```

Input RootPassword: root

4. Debugger the runner

```bash
$ ls

factory
key.pem
perflog
runners
warmup
work
```

`runners` is the working directory of workflow

### Parameters

#### `ngrok_token`

**Required** Authenticate to  ngrok agent.

#### `ngrok_proto_{x}` and `ngrok_proto_{x}`

x in [1, 2, 3] , e.g:

```yaml
- uses: shaowenchen/debugger-action@v2
  name: debugger
  timeout-minutes: 30
  continue-on-error: true
  with:
    ngrok_token: ${{ secrets.NGROK_TOKEN }}
    ngrok_addr_1: 30000
    ngrok_proto_1: tcp
    ngrok_addr_2: 30001
    ngrok_proto_2: tcp
    ngrok_addr_3: 30002
    ngrok_proto_3: tcp
```

It will expose these services to Ngrok. The maximum number of tunnels is 3, and http will take up 2 .

#### 

## How to use by Frp Server

### Prerequisites

- A [Frp Server](https://github.com/fatedier/frp)

### Usage

1. Set up your credentials as secrets in your repository settings using `FRP_SERVER_ADDR`, `FRP_SERVER_PORT`, `FRP_TOKEN`, `SSH_PORT`

|  Secrets   | Frp Server  |
|  ----  | ----  |
| `FRP_SERVER_ADDR`  | You Server IP |
| `FRP_SERVER_PORT`  | Bind port |
| `FRP_TOKEN`        | token |

`SSH_PORT` is used to login the runner, a custom set , e.g 20090 .

2. Add the following to your workflow

```yml
- uses: shaowenchen/debugger-action@v2
  name: debugger
  timeout-minutes: 30
  continue-on-error: true
  with:
    frp_server_addr: ${{ secrets.FRP_SERVER_ADDR }}
    frp_server_port: ${{ secrets.FRP_SERVER_PORT }}
    frp_token: ${{ secrets.FRP_TOKEN }}
    ssh_port: ${{ secrets.SSH_PORT }}
```

3. Run your workflow and login the runner

Each runner needs a unique `ssh_port` value.

```bash
ssh root@frp_server_addr -p ssh_port 
```

Input RootPassword: root

4. Debugger the runner

```bash
$ ls

factory
key.pem
perflog
runners
warmup
work
```

`runners` is the working directory of workflow

### Parameters

#### `timeout-minutes`

The length of time you want to debug the action.

#### `frp_server_addr`

**Required** IP address of the remote frps server.

#### `frp_server_port`

**Required** Port of the remote frps server.

#### `frp_token`

**Required** Token of the remote frps server.

#### `ssh_port`

**Required** Port to login the runner

### License

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)