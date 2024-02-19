packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}
variable "ami_username" {
  type    = string
  default = "account-id"
}

variable "profile" {
  type    = string
  default = "dev-ec2"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "name" {
  type    = string
  default = "debian-12-*"
}

variable "deviceType" {
  type    = string
  default = "ebs"
}

variable "vType" {
  type    = string
  default = "hvm"
}

variable "architecture" {
  type    = string
  default = "x86_64"
}

variable "type" {
  type    = string
  default = "t2.micro"
}

variable "ssh_user" {
  type    = string
  default = "admin"
}

variable "owner" {
  type    = string
  default = "aws-marketplace"
}

locals {
  //   timestamp = regex_replace(timestamp(), "[- TZ:]", "")
  timestamp = regex_replace(formatdate("YYYY_MM_DD_hh_mm_ss", timestamp()), "[- TZ:]", "")
}

source "amazon-ebs" "debian_base" {
  profile = "${var.profile}"
  region  = "${var.region}" # Update to your region
  source_ami_filter {
    filters = {
      name                = "${var.name}"
      root-device-type    = "${var.deviceType}"
      virtualization-type = "${var.vType}"
      architecture        = "${var.architecture}"
    }
    most_recent = true
    owners      = ["${var.owner}"] # Debian Official Owner
  }
  instance_type   = "${var.type}"
  ssh_username    = "${var.ssh_user}"
  ami_name        = "custom-created-ami-${local.timestamp}"
  ami_description = "Assignment 5 custom AMI "
  ami_users       = ["${var.ami_username}"]
  //   launch_block_device_mappings {
  //     delete_on_termination = true
  //     device_name           = "/dev/sda1"
  //     volume_size           = 25
  //     volume_type           = "gp2"
  //   }
}

build {
  sources = [
    "source.amazon-ebs.debian_base"
  ]
  // last resource
  // provisioner "file" {
  //   source="webapp-artifact"
  //   destination = "~/"
  // }


  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nodejs npm",
      "sudo apt-get install unzip",
      // "sudo apt install -y mariadb-server",
      // "sudo systemctl enable mariadb",
      // "sudo systemctl start mariadb",
      // "echo -e '\\n\\N\\nY\\nHArissh92##\\nHArissh92##\\nN\\nN\\nN\\nY\\n' | sudo mysql_secure_installation",
      "sudo apt-get install -y expect",
      "sudo apt-get install npm",
      // cloud watch installation
      "wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i amazon-cloudwatch-agent.deb",
      "sudo systemctl start amazon-cloudwatch-agent",
      "sudo systemctl enable amazon-cloudwatch-agent",


    ]
  }

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/webapp-artifact.zip"
    destination = "~/"
  }

  provisioner "file" {
    source      = "./systemd/csye6225.service"
    destination = "/tmp/csye6225.service"
  }

  provisioner "file" {
    source      = "./cloudwatchconfig.json"
    destination = "~/"
  }

  provisioner "shell" {
    inline = [
      // "echo web app zip process",
      // "sudo ls -al",
      // "sudo mv /tmp/csye6225.service /etc/systemd/system/csye6225.service",
      // "unzip webapp-artifact.zip -d web-app",
      // "sudo groupadd csye6225",
      // "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      // "sudo chown -R csye6225:csye6225 /home/admin/web-app",
      // // "sudo chown csye6225:csye6225 /home/admin/web-app/server.js",
      // "cd /home/admin/web-app",
      // "sudo npm install",
      // "sudo npm install nodemon",
      // "sudo chmod +x server.js",
      // "sudo systemctl enable csye6225",
      // "sudo systemctl start csye6225",
      // "sudo systemctl restart csye6225",
      // "sudo systemctl stop csye6225", 
      "sudo mv cloudwatchconfig.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      "echo web app zip process",
      "sudo ls -al",
      "sudo mv /tmp/csye6225.service /etc/systemd/system/csye6225.service",
      "sudo unzip webapp-artifact.zip -d /opt/web-app",
      "sudo groupadd csye6225",
      "cd /opt/web-app",
      "sudo npm install",
      "sudo npm install nodemon",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "sudo chown -R csye6225:csye6225 /opt/web-app",
      // "sudo chown csye6225:csye6225 /home/admin/web-app/server.js",
      "sudo chmod +x server.js",
      "sudo systemctl enable csye6225",
      "sudo systemctl start csye6225",
      "sudo systemctl restart csye6225",
      "sudo systemctl stop csye6225",

    ]
  }



}
