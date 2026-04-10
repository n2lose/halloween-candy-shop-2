---
name: write-tests
description: Write unit and integration tests for backend services and API endpoints. Use after implementing a feature.
---

Ask which file or feature needs tests, then:

**For backend service functions** (unit tests):
```typescript
// Pattern: describe > describe > it
describe('AuthService', () => {
  describe('validateCredentials', () => {
    it('should return user when credentials are valid', () => {
      // Arrange
      const username = 'freddy'
      const password = 'ElmStreet2019'

      // Act
      const result = validateCredentials(username, password)

      // Assert
      expect(result).toEqual({ id: 1, username: 'freddy' })
    })

    it('should return null when password is wrong', () => { ... })
    it('should return null when username does not exist', () => { ... })
  })
})
```

**For API endpoints** (integration tests with Supertest):
```typescript
describe('POST /login', () => {
  it('should return 200 with tokens for valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'freddy', password: 'ElmStreet2019' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('access_token')
    expect(res.body).toHaveProperty('refresh_token')
  })

  it('should return 401 for invalid credentials', async () => { ... })
  it('should return 400 when fields are missing', async () => { ... })
})
```

**Coverage targets**:
- Every service function: happy path + error path + edge case
- Every endpoint: 200, 401, 400, and relevant error cases
- Minimum 3 tests per function/endpoint

After writing, run `cd backend && npm test` to verify they pass.
