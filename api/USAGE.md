# Usage of the IOTA Identity SSI Bridge

## Create and verify an identity

In order to interact with other users in a trusted way there are two major calls to be done which are described in the section 1 & 2.

### 1. Create identity

The creation of an identity is one of the key aspects when interacting with other users. By creating an identity, it creates a public/private key pair which is used to verify that the identity belongs to a specific user which is able to proof so. Furthermore it is possible to add several information about this identity like a name or to which company the user belongs. Currently the SSI Bridge supports five data models: Device, Person, Organization, Service and Product. These are types which will be validated and belong mainly on the data models of https://schema.org. In addition it is possible to define custom types since there could be use cases with different data types we do not support. The type of a user is defined by the type field of a user if it is a custom type which is not known by the api it won't be validated.

The following demonstrates an example where an identity for a device will be created. Since schema.org does not have a data model for devices the device data model of FIWARE is used.


https://ensuresec.solutions.iota.org/api/v1/authentication/create-identity

Body of the POST request:
```
{
 "username": "device-of-iota",
 "type":"Device",
 "organization": "did:iota:123456rvEeXD8z6qqd1QyYNQ1QD54fXfLs6uGew3DeNu",
 "data": {
       "id": "device-9845A",
       "category": ["sensor"],
       "controlledProperty": ["fillingLevel","temperature"],
       "controlledAsset":["wastecontainer-Osuna-100"],
       "ipAddress": ["192.14.56.78"],
       "mcc": "214",
       "mnc": "07",
       "batteryLevel": 0.75,
       "serialNumber": "9845A",
       "refDeviceModel":"myDevice-wastecontainer-sensor-345",
       "rssi": 0.86,
       "value": "l=0.22;t=21.2",
       "deviceState": "ok",
       "dateFirstUsed": "2014-09-11T11:00:00Z",
       "owner": ["http://person.org/leon"]
  }
}
```

The request returns the following body:

```
{
   "doc": {
       "id": "did:iota:FuqjNydC3pKo46M6Dprks3UDuqRhaiCQiLshTfW8V8nN",
       "authentication": [
           {
               "id": "did:iota:FuqjNydC3pKo46M6Dprks3UDuqRhaiCQiLshTfW8V8nN#key",
               "controller": "did:iota:FuqjNydC3pKo46M6Dprks3UDuqRhaiCQiLshTfW8V8nN",
               "type": "Ed25519VerificationKey2018",
               "publicKeyBase58": "GV1PfKbJfprUBXkXkcgVNr4P9RKMWdb5XQLGwrzgJEZy"
           }
       ],
       "created": "2021-05-19T08:33:11Z",
       "updated": "2021-05-19T08:33:11Z",
       "proof": {
           "type": "JcsEd25519Signature2020",
           "verificationMethod": "#key",
           "signatureValue": "39BjT8Lbz57HG8DTdrmDstdprD3f3ZQAPybK5dCRZ3XVgrhPW9yCvoESSPRKxLFUCJRxRR6Dr6ZQZRcVTbi3Mpcc"
       }
   },
   "key": {
       "type": "ed25519",
       "public": "GV1PfKbJfprUBXkXkcgVNr4P9RKMWdb5XQLGwrzgJEZy",
       "secret": "6CauaVFj951FWjpZ7xDCNttzWzx5bvxzYoWPDQVjrCYW",
       "encoding": "base58"
   },
   "txHash": "9908423a125ebf14e6a5aaca957f3d455c058c5b00a07c1ca77948fd5dee4365"
}
```

This key of the body is the essential part which must be stored by the client, since it contains the public/private key pair which is used to authenticate at the api.

### 2. Verify user

Everyone can create an identity and use any data he wants to, that is why it is needed to know if the person or device really belongs to the company it is claiming to be. Hence an identity must be verified, this can be done by an administrator of the ssi bridge or an already verified user of an organization. The verification creates a so called verifiable credential, which contains information about the user and a signature proof of the information, so the data of the verifiable credential can not be changed later but verified.

The endpoint of this request is as following:

https://ensuresec.solutions.iota.org/api/v1/authentication/verify-user

The body must contain the userId of the identity which needs to be verified in the `subjectId` field. Furthermore if the user is not an administrator he needs to add a verifiable credential which was generated when verifying him. This verifiable credential is stored by the api and can be requested at the user api. How to request the verifiable credential at the api will be described in section 3. As pointed, the verifiable credential must be part of the request if it is not a request by an admin. Add the verifiable credential in the `initiatorVC` field since it is the initiator which verifies a user. The request could look like the following:

```
{
  "subjectId": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
  "initiatorVC": {
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "did:iota:AF1ss8QmCM9feWEERRBjZH72Hpg6eUvVK9jHpwz3sgcc",
    "type": [
        "VerifiableCredential",
        "PersonCredential"
    ],
    "credentialSubject": {
        "id": "did:iota:AF1ss8QmCM9feWEERRBjZH72Hpg6eUvVK9jHpwz3sgcc",
        "@context": "https://schema.org/",
        "familyName": "User",
        "givenName": "Test",
        "initiatorId": "did:iota:AUKN9UkJrTGGBcTZiYC3Yg2FLPQWnA11X8z6D6DDn56Y",
        "jobTitle": "Software Engineer",
        "name": "Test User",
        "organization": "did:iota:Hkac4k6xsuDdn7fQms6yMJsySRDDC4fH962MwP9dxWse",
        "registrationDate": "2021-05-20T10:40:47+02:00",
        "type": "Person"
    },
    "issuer": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y",
    "issuanceDate": "2021-05-20T09:18:00Z",
    "proof": {
        "type": "MerkleKeySignature2021",
        "verificationMethod": "#key-collection",
        "signatureValue": "GBQCmukPN4ghNtPv9YkacybLpRrhjPe4gLGLjRnwzsUJ.1113c4GgfJ8DpANXnaEMZVQ19UVoZHAJkZsQwx6SnSkA4EQPV3Riwb4tfvdGCkFKFA4dJ7vDLAKMHemd4ruZg1b235AUKqEypDPLBrcEsKwPyPHYeZ3TdAgnAGbH4xFkjA8sk13wa2WrKN6AvjuF47KzkdMntWVqXfrttE5L54BYU34GPttAaiAJo2LsnxTue33VNXzJ3BB382SGAFoKRDcDtJxvG6C83LbR4pq19WukLPzLWSCuxT1v3Zh2Yf329N9viTFFwQQCYQW86AEBsRxnDLzuV6MdkiD51vqmZAb9NUnkuUT2GvvMrPLSjFKw9yKqTGA8QxhuLSurMgq7nddcHctrDQFTKNv1zq5HYYHGRc5oDe5s6TjUJP1Pspsn3VtPRozqfb5yiWfJ2YHv1YL4PB4oLCconHGSjkWaqHCYUFmCpq27geiTNj7k3TZKSL2xdeL.5DT4Egs5dA8o9ET4w1daUgS3dEk4Ly1Xw2QhZmueGiYA9Jr9wvPQAmZm88GyvjskagPxdHZ5ttiUEoWz6Pw1w9y8"
    }
  }
}
```

### 3. Get user data

The verified user can now be requested to get information about him. It can be seen that he is verified by the `verification.verified` field but also by checking the verifiable credential in the `verifiableCredentials` array. To check whether the verifiable credential is still valid and not revoked the request in section 4 can be used.

https://ensuresec.solutions.iota.org/api/v1/users/user/did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v

```
{
    "userId": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
    "publicKey": "AXZhHr2roMW1s1y4xj2kBF66s7KYd2sceWffSVkuGU7P",
    "username": "iota-test-user-2",
    "type": "Person",
    "registrationDate": "2021-05-20T11:19:37+02:00",
    "verification": {
        "verified": true,
        "verificationDate": "2021-05-20T11:20:17+02:00",
        "lastTimeChecked": "2021-05-20T11:20:17+02:00",
        "verificationIssuerId": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y"
    },
    "organization": "did:iota:Hkac4k6xsuDdn7fQms6yMJsySRDDC4fH962MwP9dxWse",
    "data": {
        "name": "Test User2",
        "familyName": "User2",
        "givenName": "Test",
        "jobTitle": "Software Engineer"
    },
    "verifiableCredentials": [
        {
            "@context": "https://www.w3.org/2018/credentials/v1",
            "id": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
            "type": [
                "VerifiableCredential",
                "PersonCredential"
            ],
            "credentialSubject": {
                "id": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
                "@context": "https://schema.org/",
                "familyName": "User2",
                "givenName": "Test",
                "initiatorId": "did:iota:AF1ss8QmCM9feWEERRBjZH72Hpg6eUvVK9jHpwz3sgcc",
                "jobTitle": "Software Engineer",
                "name": "Test User2",
                "organization": "did:iota:Hkac4k6xsuDdn7fQms6yMJsySRDDC4fH962MwP9dxWse",
                "registrationDate": "2021-05-20T11:19:37+02:00",
                "type": "Person"
            },
            "issuer": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y",
            "issuanceDate": "2021-05-20T09:20:16Z",
            "proof": {
                "type": "MerkleKeySignature2021",
                "verificationMethod": "#key-collection",
                "signatureValue": "5F1i6ach4xspjsZxfvHLLNY2gmGHqD1mSEnCR8EKqcr6.1113qFgzV145ijWBpfLSkUw7M7h8ijgBiw2KRz59BXeEjQ2ohAKGmqFALvcgS6HwSaWqhgFqecpQan9Cs7BNfdPAxVYGDxoZPRhWHaHawkeULxeTbtLMgtxzaVwNKiYzm9nDD5XU8uoFyodNWWiE8PrrYYyTWHLJMCZLKyxYCXqVnaG2D7FA4P8rUm3xcjeRXuFENWmvwMsRoUUooZLLMZPWnsYs3svjNBTVVfZiN9wK4cN88FheuWSkRbLrYvBLqEaxgtK7MenB47umA4R8XLgaj6WeFSujnVJDCdDjdMm37FZuYViVqwiSqDUUFu2jqapdf59zusALUWbjuJMGhgP2a6SRHPEpsx9WBZHF44UBkSC5wrRf2xJ1aC6TCbxpkThu7pLvF7QBMcYarNKdkQiri8CX55cfa2HNbrW1rhJdtsEXRoW7xgy65e3cNMXseJ4ZDRW.4pqU1cCMgqLYFZcRFxAfbs7D7BjhspTMP4b7ngBkQstjNxzBszGeRe7z7XsFRwWyZL6PC9QZuwVMzxr83UwmXjk"
            }
        }
    ],
    "role": "User"
}
```


### 4. Check verifiable credential

https://ensuresec.solutions.iota.org/api/v1/authentication/check-verification

Simply insert the verifiable credential into the body of the POST request.

```
{
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
    "type": [
        "VerifiableCredential",
        "PersonCredential"
    ],
    "credentialSubject": {
        "id": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
        "@context": "https://schema.org/",
        "familyName": "User2",
        "givenName": "Test",
        "initiatorId": "did:iota:AF1ss8QmCM9feWEERRBjZH72Hpg6eUvVK9jHpwz3sgcc",
        "jobTitle": "Software Engineer",
        "name": "Test User2",
        "organization": "did:iota:Hkac4k6xsuDdn7fQms6yMJsySRDDC4fH962MwP9dxWse",
        "registrationDate": "2021-05-20T11:19:37+02:00",
        "type": "Person"
    },
    "issuer": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y",
    "issuanceDate": "2021-05-20T09:20:16Z",
    "proof": {
        "type": "MerkleKeySignature2021",
        "verificationMethod": "#key-collection",
        "signatureValue": "5F1i6ach4xspjsZxfvHLLNY2gmGHqD1mSEnCR8EKqcr6.1113qFgzV145ijWBpfLSkUw7M7h8ijgBiw2KRz59BXeEjQ2ohAKGmqFALvcgS6HwSaWqhgFqecpQan9Cs7BNfdPAxVYGDxoZPRhWHaHawkeULxeTbtLMgtxzaVwNKiYzm9nDD5XU8uoFyodNWWiE8PrrYYyTWHLJMCZLKyxYCXqVnaG2D7FA4P8rUm3xcjeRXuFENWmvwMsRoUUooZLLMZPWnsYs3svjNBTVVfZiN9wK4cN88FheuWSkRbLrYvBLqEaxgtK7MenB47umA4R8XLgaj6WeFSujnVJDCdDjdMm37FZuYViVqwiSqDUUFu2jqapdf59zusALUWbjuJMGhgP2a6SRHPEpsx9WBZHF44UBkSC5wrRf2xJ1aC6TCbxpkThu7pLvF7QBMcYarNKdkQiri8CX55cfa2HNbrW1rhJdtsEXRoW7xgy65e3cNMXseJ4ZDRW.4pqU1cCMgqLYFZcRFxAfbs7D7BjhspTMP4b7ngBkQstjNxzBszGeRe7z7XsFRwWyZL6PC9QZuwVMzxr83UwmXjk"
    }
}
```

It should return:

```
{
    "isVerified": true
}
```

for verified users and false for not verified users. A reason for not verified verifiable credentials could be:

- Data of verifiable credential was altered (so it does not match with the hash)
- Verifiable credential got revoked (as described in section 5)



### 5. Revoke verifiable credential

A verifiable credential can be revoked so it is no more verified, a reason therefor could be: A person left the organization or a device broke and got removed. To revoke the credential the following api must be called via POST:

https://ensuresec.solutions.iota.org/api/v1/authentication/revoke-verification

The body of the request contains the `subjectId` which is the userId of the user which credential shall be revoked furthermore the signature of the credential must be part as the `signatureValue` field to identify the verifiable credential which needs to be revoked.

```
{
   "subjectId": "did:iota:D3TG1ojfVhpA28L4DVaHBYzNPYS6JBjfZT2ZYKEovs1v",
   "signatureValue": "5F1i6ach4xspjsZxfvHLLNY2gmGHqD1mSEnCR8EKqcr6.1113qFgzV145ijWBpfLSkUw7M7h8ijgBiw2KRz59BXeEjQ2ohAKGmqFALvcgS6HwSaWqhgFqecpQan9Cs7BNfdPAxVYGDxoZPRhWHaHawkeULxeTbtLMgtxzaVwNKiYzm9nDD5XU8uoFyodNWWiE8PrrYYyTWHLJMCZLKyxYCXqVnaG2D7FA4P8rUm3xcjeRXuFENWmvwMsRoUUooZLLMZPWnsYs3svjNBTVVfZiN9wK4cN88FheuWSkRbLrYvBLqEaxgtK7MenB47umA4R8XLgaj6WeFSujnVJDCdDjdMm37FZuYViVqwiSqDUUFu2jqapdf59zusALUWbjuJMGhgP2a6SRHPEpsx9WBZHF44UBkSC5wrRf2xJ1aC6TCbxpkThu7pLvF7QBMcYarNKdkQiri8CX55cfa2HNbrW1rhJdtsEXRoW7xgy65e3cNMXseJ4ZDRW.4pqU1cCMgqLYFZcRFxAfbs7D7BjhspTMP4b7ngBkQstjNxzBszGeRe7z7XsFRwWyZL6PC9QZuwVMzxr83UwmXjk"
}
```

### 6. Trusted roots

In regard to support verifiable credentials of other systems, the root of their network of trust can be added to the api. When checking a verifiable credential it checks:

- Is the signature and content of the credential the same
- Is the credential valid or revoked
- Is the issuer id trusted

To receive the list of trusted identities the SSI Bridge offers an endpoint which can be called as the following:

https://ensuresec.solutions.iota.org/api/v1/authentication/trusted-roots

It returns all trusted identity ids which are trusted by the api.

```
{
    "trustedRoots": [
        "did:iota:HUReLjBy79sk4Jbah9S56GtRDyGoEskHdQjFXSashKGr",
        "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y"
    ]
}
```

### 7. Get latest document

To receive the latest document of an identity from the tangle, the SSI Bridge also offers an endpoint which can be called via GET.

https://ensuresec.solutions.iota.org/api/v1/authentication/latest-document

It returns information about the identity document on the tangle.

```
{
    "id": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y",
    "verificationMethod": [
        {
            "id": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y#key-collection",
            "controller": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y",
            "type": "MerkleKeyCollection2021",
            "publicKeyBase58": "11CBvuBTkkEtgKdkTfAA8sgbNFbE3MY8fgkUhPui14DQMX"
        }
    ],
    "authentication": [
        {
            "id": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y#key",
            "controller": "did:iota:8P4uV9haNks6N8aXXLt2Ps3nQtSqGXc2kJM4K6urm62Y",
            "type": "Ed25519VerificationKey2018",
            "publicKeyBase58": "5qd3USRkKFJssgUNuhttU5k6Vhht5r6z2rnNhoceuCx"
        }
    ],
    "created": "2021-05-20T08:16:08Z",
    "updated": "2021-05-20T08:16:08Z",
    "previousMessageId": "094952d1dbfb1f1d57402ca5c5764da5ff0d827738fea580a86f3dbd873511d6",
    "proof": {
        "type": "JcsEd25519Signature2020",
        "verificationMethod": "#key",
        "signatureValue": "4cExSH6Ut19QLRowuxuN58Z8QesQWEmUGSFWK2d5jWQayBX9PVeWL689ph78NcBFJnkYjpFsPq2YkofKGksJn8oD"
    }
}
```