#!/usr/bin/env node
import axios from 'axios'

export class Requester {
  constructor(url, token, org, bucket) {
    this.url = url;
    this.token = token;

    this.axiosInstance = axios.create({
      baseURL: this.url,
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    return this.axiosInstance;
  }
}
