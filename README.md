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
    <li>
      <a href="#installation">Installation</a>
      <ul>
        <li><a href="#setup-backend-service">Setup backend Service</a></li>
        <li><a href="#setup-frontend-service">Setup frontend Service</a></li>
        <li><a href="#setup-reverse-proxy">Setup Reverse Proxy</a></li>
      </ul>  
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#notes">Notes</a>
      <ul>
        <li><a href="#connect-to-ec2-instance">Connect to EC2 instance</a></li>
        <li><a href="#connect-to-rds-instance">Connect to RDS instance</a></li>
      </ul>
    </li>
    <li><a href="#documents-or-links">Documents or Links</a></li>

  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

### Intro
This is an repo for remote assignments.


### Built With
- React.js
- Express.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
1. aws root account or user 
2. EC2 instance and RDS instance
3. nvm(Node Version Manager) installed
4. [pm2](https://www.npmjs.com/package/pm2) package installed
5. Nginx installed or Enabled

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

#### Enable Nginx on aws EC2 Amazon Linux 2 instance
Nginx is the in the amazon-linux-extras package, type command to see if the nginx is enabled or not.
1. Check amazon-linux-extras package
```shell
which amazon-linux-extras
amazon-linux-extras
```
2. install if the Nginx is not enabled
```shell
sudo amazon-linux-extras enable nginx1
```

> **info**: See the below setup steps for reveres proxy.


## Installation

1. clone this repo
```shell
  git clone https://github.com/VictorChao996/remote-assignments.git
```
2. Install the nvm(Linux)
   - See the setup steps above.👍
### Setup backend (Express App)


1. Set environment variable for DB connect
   - make an .env file with the following content,replace the content with your own username and password
```shell
MYSQL_USER = "user";
PASSWORD = "password";
```
> **Warning:**: This step could not be skipped.
   
2. start the express app in the background
```shell
pm2 start index.js -n backend
```
> **info**: This step can run node.js app in background, see more details here: [pm2](https://www.npmjs.com/package/pm2)

### Setup Frontend (React app)
1. Install package: `npm install`
2. Set environment variable for Fetch API
    - Add the .env file in the frontend root folder
```txt
REACT_APP_BACKEND_API_URL = "api/"
```
> **Warning**: This Step should not be skipped.
3. Build the project: `npm run build`
4. Set up Nginx configuration file.

### Setup Reverse Proxy (Nginx)
1. Move to the Nginx folder
```shell
cd /etc/nginx
```
2. Make a new configuration file
```
sudo mkdir sites-available
cd sites-available
nano my-react-app.conf
```
3. Create Proxy Rule in configuration file
- frontend: /
- backend: /api/
```txt
server {
        listen 80;
        server_name [public serve name];

        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization,Content-Type";

        location / {
                root [your/filepath/to/react/build];
                index index.html;
                try_files $uri $uri/ /index.html;
        }

        location  /api/ {
                resolver 8.8.8.8;
                rewrite /api(/.*) $1 break;
                proxy_pass [your/backend/server/uri];
        }
}
```
4. Link the my-react-app.conf to the nginx folder (Optional)
```shell
sudo ln -s /etc/nginx/sites-available/my-react-app/conf /etc/nginx/
```
5. include the my-react-app.conf in the nginx.conf file
- add following content in the http block.
```shell
include /etc/nginx/my-react-app.conf
```
6. Test and Start the Nginx Server
```shell
sudo nginx -t
sudo systemctl start nginx
```
> **info**: see the error log in the directory `/var/log/nginx/error.log`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage
- visit the frontend page: http://54.64.217.57
- check the backend service: http://54.64.217.57/api/healthcheck

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes

### Connect to EC2 instance

#### Methods 1
- connect by "EC2 Instance Connect" button
#### Methods 2(SSH client)
- connet by the SSH through private key and public DNS
```shell
    ssh -i "EC2KeyPair.pem" ec2-user@ec2-54-64-217-57.ap-northeast-1.compute.amazonaws.com
```
> after connect you will see the EC2 graph in the terminal.

### Connect to RDS instance
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

## Documents or Links
### AWS services
- [Tutorial: Get started with Amazon EC2 Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)
- [Elastic IP addresses](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)
- [Amazon EC2 security groups for Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)
- [Security group rules for different use cases](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html)
- [Creating and connecting to a MySQL DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.MySQL.html)
- [Amazon RDS 故障診斷](https://docs.aws.amazon.com/zh_tw/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Connecting)

### npm package
- [Express](https://expressjs.com/)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [pm2](https://pm2.keymetrics.io/)
### Nginx(reverse proxy)
- [Install NGINX Plus](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/)
- [Configuring NGINX and NGINX Plus as a Web Server](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/)


<p align="right">(<a href="#readme-top">back to top</a>)</p>











