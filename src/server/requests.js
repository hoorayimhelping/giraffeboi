#!/usr/bin/env node
import axios from 'axios'

export class Requester {
  constructor(url, token, org, bucket) {
    this.url = url;
    this.token = token;
    this.org = org;
    this.bucket = bucket;

    this.axiosInstance = axios.create({
      baseURL: this.url
    });

    console.log('yeah', this)
  }
}
