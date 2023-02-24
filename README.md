# Remote Homework
<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#intro">Intro</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#notices">Notices</a></li>

  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

### Intro
This is an repo for remote assignments.


### Built With
- Express.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
1. aws root account or user 
2. EC2 instance and RDS instance
3. nvm(Node Version Manager) installed

> **info** :see the following installation step


#### SetUp EC2 instance and RDS instance
The installation follow by below instructions.
1. create EC2 instance
   - OS Images: Amazon Linux 2 AMI
   - Instance type: t2.micro
   - Storage size: 8 GiB
2. create RDS instance
    - Engine type: MySQL 8.0.28
    - Instance tyupe: db.t4g.micro
    - Storage size: 20 GiB
3. connect EC2 to RDS by setting(this will add rules to a new security group)
4. Associate Elastic IP to EC2 instance
5. Modify the security group so that we can connect to EC2 by SSH client
6. Modify the security group and the **route table rule** so that RDS can be connect from PC(outside the VPC?)

#### Setup NVM(Node Version Manager) and Node
1. install commands(Linux)
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
2. check if the nvm is successfully installed.
```shell
nvm --version
```
3. install lts or specific version
```shell
nvm install node
nvm install 16
```
> **Warnings**: AWS Linux 2 目前只支援 16.x 版本的node
4. use specific version
```shell
nvm use 16
```
5. Check the npm and node version
```shell
npm --version
node -v
```

## Installation
### Setup an Express App
1. clone this repo
```shell
  git clone https://github.com/VictorChao996/remote-assignments.git
```
2. Install the nvm(Linux)
   - See the setup steps above.👍

3. set up the .env file for DB connect
   - make an .env file with the following content,replace the content with your own username and password
```shell
MYSQL_USER = "user";
PASSWORD = "password";
```
> **Warning:**: This step could not be skipped.
   
4. start the express app with
```shell
node index.js
```



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

### Connect EC2

#### Methods 1
- connect by "EC2 Instance Connect" button
#### Methods 2(SSH client)
- connet by the SSH through private key and public DNS
```shell
    ssh -i "EC2KeyPair.pem" ec2-user@ec2-54-64-217-57.ap-northeast-1.compute.amazonaws.com
```
> after connect you will see the EC2 graph in the terminal.

### Connect to RDS
#### methods 1: through EC2
After connect to EC2 simply type
```shell
telnet [RDS instance endpoint] 3306 
```
to test the connection.

#### methods 2: through PC
```shell
telnet [RDS instance endpoint] 3306 
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notices
> **Warning**


> **Note**
> - RDS 很調皮，如果PC連不上可以參考[Amazon RDS 故障診斷](https://docs.aws.amazon.com/zh_tw/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Connecting)











