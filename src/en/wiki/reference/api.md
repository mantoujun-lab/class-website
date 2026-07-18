---
title: API Reference
description: Quick reference for common APIs
layout: layouts/wiki
permalink: /wiki/reference/api/
order: 1
wikiCategory: 📚 Reference
wikiCategoryOrder: 2
---

# API Reference

This page documents usage examples for commonly used APIs.

## API key retrieval steps

Below are brief steps to obtain an API key:
1. Obtain an API key or access token
2. Read the API documentation
3. Construct the HTTP request
4. Send the request and handle the response
5. Finish

## Common API request examples

The following examples show common API request structures:

- Request methods: GET, POST, PUT, DELETE
- Request URL: endpoint provided by the API service
- Request headers: include Authorization, Content-Type, etc.
- Request body: JSON-formatted data

### Example: Get user data

```http
GET /api/v1/user/profile
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

### Example: Create a resource

```http
POST /api/v1/resource
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "name": "example resource",
  "type": "example"
}
```

## Recommendations

- Keep your API key safe and do not expose it in public repositories.
- Set request parameters and response handling correctly according to the documentation.
- If you encounter errors, first check that the request URL, headers, and body are correct.
- Use HTTPS to ensure secure transmission.
