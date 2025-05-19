async function init() {
  try {
    const fs = require('fs');
    const dbInstance = db.getSiblingDB('maple');
    const events = [
      {
        _id: ObjectId('682b7ed12aeb8629cd0b3b6e'),
        name: '주황버섯을 잡아요!',
        description: '주황버섯을 아주 많이 잡는 이벤트입니다.',
        state: 'STARTED',
        startedAt: new Date('2025-05-18T11:55:29.000Z'),
        endedAt: new Date('2030-05-30T11:55:29.000Z'),
        condition: {
          type: 'KILL_MONSTER',
          startedAt: new Date('2025-05-18T11:55:29.000Z'),
          endedAt: new Date('2025-05-30T11:55:29.000Z'),
          config: [
            { monsterUuid: '123', monsterName: '주황버섯', killCount: 50000 },
            { monsterUuid: '124', monsterName: '주황버섯2', killCount: 50000 },
          ],
        },
        rewards: [
          {
            type: 'ITEM',
            name: '눈물',
            count: 1,
            itemId: '1',
            _id: ObjectId('682b7ed12aeb8629cd0b3b6f'),
            uuid: '0196e9e7-6092-7995-bb41-0c0eebc89628',
            createdAt: new Date('2025-05-19T18:56:17.045Z'),
            updatedAt: new Date('2025-05-19T18:56:17.045Z'),
          },
        ],
        uuid: '0196e9e7-6092-7995-bb41-0c0f7a9a8c01',
        createdAt: new Date('2025-05-19T18:56:17.045Z'),
        updatedAt: new Date('2025-05-19T18:56:17.045Z'),
        __v: 0,
      },
      {
        _id: ObjectId('682b7edc2aeb8629cd0b3b71'),
        name: '주황버섯을 잡아요!',
        description: '주황버섯을 아주 많이 잡는 이벤트입니다.',
        state: 'PENDING',
        startedAt: new Date('2025-05-18T11:55:29.000Z'),
        endedAt: new Date('2030-05-30T11:55:29.000Z'),
        condition: {
          type: 'KILL_MONSTER',
          startedAt: new Date('2025-05-18T11:55:29.000Z'),
          endedAt: new Date('2025-05-30T11:55:29.000Z'),
          config: [
            { monsterUuid: '123', monsterName: '주황버섯', killCount: 50000 },
            { monsterUuid: '124', monsterName: '주황버섯2', killCount: 50000 },
          ],
        },
        rewards: [
          {
            type: 'ITEM',
            name: '눈물',
            count: 1,
            itemId: '1',
            _id: ObjectId('682b7edc2aeb8629cd0b3b72'),
            uuid: '0196e9e7-8c17-76c3-95a5-8e1b135f71ca',
            createdAt: new Date('2025-05-19T18:56:28.183Z'),
            updatedAt: new Date('2025-05-19T18:56:28.183Z'),
          },
        ],
        uuid: '0196e9e7-8c17-76c3-95a5-8e1c3d9e75a5',
        createdAt: new Date('2025-05-19T18:56:28.184Z'),
        updatedAt: new Date('2025-05-19T18:56:28.184Z'),
        __v: 0,
      },
    ];

    const users = [
      {
        _id: {
          $oid: '682b7b54db08d000781a7d89',
        },
        email: 'asdasfafs1@asdasfafsf.com',
        password:
          '$2b$10$NuAlhfTqxa0o5RbG7aMNC.wwMbIa8dbcybR9NYLOlm6ARquirfYlu',
        roles: ['ADMIN'],
        state: 'ACTIVE',
        uuid: '0196e9d9-c301-7148-85bc-214d922584de',
        createdAt: {
          $date: '2025-05-19T18:41:24.737Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:24.737Z',
        },
        __v: 0,
        jtl: '70e6cbbf-0021-4d84-92fe-ab2c42136f77',
      },
      {
        _id: {
          $oid: '682b7b55db08d000781a7d8c',
        },
        email: 'asdasfafs2@asdasfafsf.com',
        password:
          '$2b$10$kNc2NjJg7PbMoYDQvN1dwuRaFfDY1cBk7SzgfITOdV5H9s60r0Kem',
        roles: ['ADMIN'],
        state: 'ACTIVE',
        uuid: '0196e9d9-c717-7c77-9113-b52464621bab',
        createdAt: {
          $date: '2025-05-19T18:41:25.783Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:25.783Z',
        },
        __v: 0,
        jtl: '2b90fcad-d374-4ce2-8df4-def7756d2856',
      },
      {
        _id: {
          $oid: '682b7b56db08d000781a7d8f',
        },
        email: 'asdasfafs3@asdasfafsf.com',
        password:
          '$2b$10$QYc9.gUJHnaBp86faowAEOt0gxAUKAMoSBKCHhSsMXBI.piwheWcG',
        roles: ['ADMIN'],
        state: 'ACTIVE',
        uuid: '0196e9d9-ca02-7ba5-a99e-7a93fd79c7c8',
        createdAt: {
          $date: '2025-05-19T18:41:26.530Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:26.530Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b57db08d000781a7d92',
        },
        email: 'asdasfafs4@asdasfafsf.com',
        password:
          '$2b$10$MHZWfNa8QErq6XPCreXaeuoArziSxOs.zQZCbDl6v3N0fAk0vjlRm',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-cc86-7945-8241-2c9f359eee45',
        createdAt: {
          $date: '2025-05-19T18:41:27.174Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:27.174Z',
        },
        __v: 0,
        jtl: '2253428f-b4aa-4427-92fd-276a4f5754aa',
      },
      {
        _id: {
          $oid: '682b7b57db08d000781a7d95',
        },
        email: 'asdasfafs5@asdasfafsf.com',
        password:
          '$2b$10$uDFjidae92VdMy5JjrCAfeMLvymnhum/awZcysLsUqxLpU/DmU4ma',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-cf1b-7cac-86af-b126b836241d',
        createdAt: {
          $date: '2025-05-19T18:41:27.835Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:27.835Z',
        },
        __v: 0,
        jtl: 'bfc31871-d86b-41bb-aa60-577064491f03',
      },
      {
        _id: {
          $oid: '682b7b58db08d000781a7d98',
        },
        email: 'asdasfafs6@asdasfafsf.com',
        password:
          '$2b$10$o51xzqGkqHH7iaIF/I7pIeknGNE7egU8TdRZNLXiLkzHJEQwVODru',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-d1fa-787e-ab2b-e167876b22f7',
        createdAt: {
          $date: '2025-05-19T18:41:28.570Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:28.570Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b59db08d000781a7d9b',
        },
        email: 'asdasfafs7@asdasfafsf.com',
        password:
          '$2b$10$/X8jOw6mGO6hSF9RXFWXUet8KGeQIF.2LHYa6cnJ69n6mzaRpk3x6',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-d5a4-70d2-9e4a-2a396b9100db',
        createdAt: {
          $date: '2025-05-19T18:41:29.508Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:29.508Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b5adb08d000781a7d9e',
        },
        email: 'asdasfafs8@asdasfafsf.com',
        password:
          '$2b$10$nkx6gjZNNRniv7DFPVZUhub.g96qDPSQksFRnjQ4t812s27m9jD/m',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-d88e-7325-b0d9-73d4071afd0c',
        createdAt: {
          $date: '2025-05-19T18:41:30.254Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:30.254Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b5adb08d000781a7da1',
        },
        email: 'asdasfafs9@asdasfafsf.com',
        password:
          '$2b$10$a0192ggQYTWCxr/JaLc3xuJaw9HQSOvU/GFAVqZqllQIcSg0uiciK',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-dad1-7b98-bac3-15050683b307',
        createdAt: {
          $date: '2025-05-19T18:41:30.833Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:30.833Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b5bdb08d000781a7da4',
        },
        email: 'asdasfafs10@asdasfafsf.com',
        password:
          '$2b$10$QEjT7LkzC9jfBSe/9BD61.1/S3GJNl85w1GbRf8I5JbvARN4pFSpS',
        roles: ['OPERATOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-decc-7f6a-bc58-f27ed82dc679',
        createdAt: {
          $date: '2025-05-19T18:41:31.852Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:31.852Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b5cdb08d000781a7da7',
        },
        email: 'asdasfafs11@asdasfafsf.com',
        password:
          '$2b$10$NiHz/ayyYG2/NAaMXrghyOHxpZOdG6ZPao5bH5pUdjfX75e96E5Me',
        roles: ['AUDITOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-e256-7124-a83b-275371aabd24',
        createdAt: {
          $date: '2025-05-19T18:41:32.758Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:32.758Z',
        },
        __v: 0,
        jtl: '2b9925ca-aadb-4e3f-a585-57d4ec4b66f5',
      },
      {
        _id: {
          $oid: '682b7b5ddb08d000781a7daa',
        },
        email: 'asdasfafs12@asdasfafsf.com',
        password:
          '$2b$10$K7TA74SpLbgzv0ioNIBGpeCv0sJsLdcpLpRKrKFOUMY4ekLtZ06A6',
        roles: ['AUDITOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-e59e-772a-872b-f09185f50a52',
        createdAt: {
          $date: '2025-05-19T18:41:33.598Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:33.598Z',
        },
        __v: 0,
        jtl: '266bb79c-019b-4589-86b8-aa4ee20afe26',
      },
      {
        _id: {
          $oid: '682b7b5edb08d000781a7dad',
        },
        email: 'asdasfafs13@asdasfafsf.com',
        password:
          '$2b$10$eNJkAd4Ss/xWzMMylRbsmOMMgUoUqoPMWKXFuRX53xUVPAv36nEgG',
        roles: ['AUDITOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-e820-73a7-a74c-17d18eb9047e',
        createdAt: {
          $date: '2025-05-19T18:41:34.240Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:34.240Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b5fdb08d000781a7db0',
        },
        email: 'asdasfafs14@asdasfafsf.com',
        password:
          '$2b$10$ESAJoPW00ekWIWTkVqDrJebiBW7CpNWDi32AWsVYReKsPge7.9FJu',
        roles: ['AUDITOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-eb4b-7684-8e16-4e83c3fa1c3a',
        createdAt: {
          $date: '2025-05-19T18:41:35.051Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:35.051Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b5fdb08d000781a7db3',
        },
        email: 'asdasfafs15@asdasfafsf.com',
        password:
          '$2b$10$fW.xSH.GSWOF4RuUHMdtbO9K.2/3mBImW3INskox2PsdVaWuCJtIC',
        roles: ['AUDITOR'],
        state: 'ACTIVE',
        uuid: '0196e9d9-ee81-7816-be9e-9b929720a192',
        createdAt: {
          $date: '2025-05-19T18:41:35.873Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:35.873Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b61db08d000781a7db6',
        },
        email: 'asdasfafs16@asdasfafsf.com',
        password:
          '$2b$10$f61FNWCCG0Gt.AxOXTNyM.CFg3qtudeDHnylnldv5aEtal8PhG6qK',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9d9-f42d-7156-b865-6dd612745f69',
        createdAt: {
          $date: '2025-05-19T18:41:37.325Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:37.325Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b62db08d000781a7db9',
        },
        email: 'asdasfafs17@asdasfafsf.com',
        password:
          '$2b$10$ao.oFs7s8Snnd0vtaT4AoupJJMha6EtJ4lwpf5txSV5c8JhE/BqvK',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9d9-f796-72fc-b822-051ce5b22072',
        createdAt: {
          $date: '2025-05-19T18:41:38.198Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:38.198Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b62db08d000781a7dbc',
        },
        email: 'asdasfafs18@asdasfafsf.com',
        password:
          '$2b$10$JNcDJmdewSuUQuMPSKHtDuZb8cBDd1.exQDjIy2/bdNviRgz52tYy',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9d9-fa41-7097-abd1-1d81d97a922f',
        createdAt: {
          $date: '2025-05-19T18:41:38.881Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:38.881Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b63db08d000781a7dbf',
        },
        email: 'asdasfafs19@asdasfafsf.com',
        password:
          '$2b$10$cFILVQ/yp2hEPazpZ4BnTu98BFnGOueDPviWrrOXD2pzGqahI052W',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9d9-fc79-71a2-913a-eb5cb1af0689',
        createdAt: {
          $date: '2025-05-19T18:41:39.449Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:39.449Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b64db08d000781a7dc2',
        },
        email: 'asdasfafs20@asdasfafsf.com',
        password:
          '$2b$10$i/f6oaANX7PKW914THDHeuyipacJwapGD8VFIe2ndFMYgV1Egl.Gq',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-0071-738d-b50a-e44b30da3792',
        createdAt: {
          $date: '2025-05-19T18:41:40.465Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:40.465Z',
        },
        __v: 0,
        jtl: '9bd80956-0e17-4f0e-af74-b7b734ff5201',
      },
      {
        _id: {
          $oid: '682b7b65db08d000781a7dc5',
        },
        email: 'asdasfafs21@asdasfafsf.com',
        password:
          '$2b$10$yEQG.gaEXSOU6t.iocOOtuhq524pco5XkAHLPvm/K53N.rHFVD2/.',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-039c-7851-b154-3edf994897b9',
        createdAt: {
          $date: '2025-05-19T18:41:41.276Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:41.276Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b65db08d000781a7dc8',
        },
        email: 'asdasfafs22@asdasfafsf.com',
        password:
          '$2b$10$A.3kKrdpWn/dzvN8wSS9oeq1tNhYzo0D.5xGTV2.W7zAubzXp.apC',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-0606-7e12-ae73-cdf7d05cfa92',
        createdAt: {
          $date: '2025-05-19T18:41:41.894Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:41.894Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b66db08d000781a7dcb',
        },
        email: 'asdasfafs23@asdasfafsf.com',
        password:
          '$2b$10$uNOQJscAL2YCU2mCozPP3uz/e.a.aiVuctZ9YmyJwVROSxehkNXh6',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-08f7-7266-9dbd-a621e42bc25d',
        createdAt: {
          $date: '2025-05-19T18:41:42.647Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:42.647Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b67db08d000781a7dce',
        },
        email: 'asdasfafs24@asdasfafsf.com',
        password:
          '$2b$10$P/07ZOLT1Q77D1AWASj2su2IGywIKvka.iY/sHORtdGink.xuKqU6',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-0bcf-76a8-95ab-59a5071a4478',
        createdAt: {
          $date: '2025-05-19T18:41:43.375Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:43.375Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b67db08d000781a7dd1',
        },
        email: 'asdasfafs25@asdasfafsf.com',
        password:
          '$2b$10$aQRA2UziOjwcN6LSG8L6wuxZ5ojOBMpxPqxIwXFvLO2nG9eQx6N6G',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-0e37-7032-82db-b96962a06da6',
        createdAt: {
          $date: '2025-05-19T18:41:43.991Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:43.991Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b68db08d000781a7dd4',
        },
        email: 'asdasfafs26@asdasfafsf.com',
        password:
          '$2b$10$RF8QHw.UBqjJ6rLWg0lZnOvK5ZGbmvcA7oa31Jnds8nZLD0fksHwy',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-119c-72dc-ac14-127ceeb1240f',
        createdAt: {
          $date: '2025-05-19T18:41:44.860Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:44.860Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b69db08d000781a7dd7',
        },
        email: 'asdasfafs27@asdasfafsf.com',
        password:
          '$2b$10$2wW88eY/aTJPw.nh7o5wzutCYJ0B.zKrulrFEZFkzkXfq8kJmRzF6',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-14ed-7b19-9453-fff54540a32d',
        createdAt: {
          $date: '2025-05-19T18:41:45.709Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:45.709Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6adb08d000781a7dda',
        },
        email: 'asdasfafs28@asdasfafsf.com',
        password:
          '$2b$10$R0KLJ.7vq0jUPxLJIZYJduK1m3xlbMeZMr2FCHXxrSh0WvwIutiZi',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-1872-7fe9-93b2-433a01b4e9ad',
        createdAt: {
          $date: '2025-05-19T18:41:46.610Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:46.610Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6bdb08d000781a7ddd',
        },
        email: 'asdasfafs29@asdasfafsf.com',
        password:
          '$2b$10$r7/8FEr3OasQr/Q4WI.UDuSg38jPuyZmjczFokXi74sq3s0E3hrfu',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-1af9-78bf-8c16-38849606cce0',
        createdAt: {
          $date: '2025-05-19T18:41:47.257Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:47.257Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6cdb08d000781a7de0',
        },
        email: 'asdasfafs30@asdasfafsf.com',
        password:
          '$2b$10$bx/jc8KApxueyL/46cZG/.X2lKHtyWhx4EVluwBWTTPy/eNjSFOOm',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-1e3a-7d16-b91a-ef2a6e7b48a3',
        createdAt: {
          $date: '2025-05-19T18:41:48.090Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:48.090Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6cdb08d000781a7de3',
        },
        email: 'asdasfafs31@asdasfafsf.com',
        password:
          '$2b$10$jfpp8oEY6T66P1Hw8HMp2ODl60yUYDXHt/VIVzfH91pVrIbQaOh7y',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-2158-74e1-8e08-e5e72219ec6e',
        createdAt: {
          $date: '2025-05-19T18:41:48.888Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:48.888Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6edb08d000781a7de6',
        },
        email: 'asdasfafs32@asdasfafsf.com',
        password:
          '$2b$10$KZWlOuG3VLpJtlL1Kz/i4upCfdP8KIIOwpDTM0d3W0YXVsvnGBNd.',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-2612-784e-a518-c5b5ad93d7f6',
        createdAt: {
          $date: '2025-05-19T18:41:50.098Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:50.098Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6edb08d000781a7de9',
        },
        email: 'asdasfafs33@asdasfafsf.com',
        password:
          '$2b$10$i.YGhPY/gWJWCefswCW2GO6ZzSS4zNA4LKwN8XhkMscD3DIJ0C8WS',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-28d5-7735-86a4-eab808997c43',
        createdAt: {
          $date: '2025-05-19T18:41:50.805Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:50.805Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b6fdb08d000781a7dec',
        },
        email: 'asdasfafs34@asdasfafsf.com',
        password:
          '$2b$10$IqPuYVKR2jyfRw6DBZubJ.sjX9JjQ57okiuBr/0dj6hFP1FhFXBne',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-2b7e-7ec4-8606-5b307ef30de9',
        createdAt: {
          $date: '2025-05-19T18:41:51.486Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:51.486Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b71db08d000781a7def',
        },
        email: 'asdasfafs35@asdasfafsf.com',
        password:
          '$2b$10$O0Ki4plu71G1wHrZpGeBIeGDUKMjKFf/6OuULux3IjUJyeEpyX9Uy',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-34a8-79dc-93e2-e1821d6fb2d9',
        createdAt: {
          $date: '2025-05-19T18:41:53.832Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:53.832Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b72db08d000781a7df2',
        },
        email: 'asdasfafs36@asdasfafsf.com',
        password:
          '$2b$10$EyU7QT67CvA0s9xgkzbx2.4Y.VyLRTYqIm805GhDO.msqUq8rEBV.',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-3849-7bc1-912b-74743daf8d4f',
        createdAt: {
          $date: '2025-05-19T18:41:54.761Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:54.761Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b74db08d000781a7df5',
        },
        email: 'asdasfafs37@asdasfafsf.com',
        password:
          '$2b$10$d976Dak.D/tPSJ/8/DEcwODIVHDZaybK4qGFe.5hEIEa0Ugl8.fvK',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-3e71-77d5-9ad8-ddcdb1337e08',
        createdAt: {
          $date: '2025-05-19T18:41:56.337Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:56.337Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b75db08d000781a7df8',
        },
        email: 'asdasfafs38@asdasfafsf.com',
        password:
          '$2b$10$7xfJ8FUo9635kipaGb7WUOlZtT7Jqdp2llXUB34sx.SwcSFnyboWy',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-4129-7dd0-bed6-b397caf08367',
        createdAt: {
          $date: '2025-05-19T18:41:57.033Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:57.033Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b75db08d000781a7dfb',
        },
        email: 'asdasfafs39@asdasfafsf.com',
        password:
          '$2b$10$3vJL.1bDseRDdWFBu/ZFU.zdOsetdZpGIFqpf76vMfdpNvAuAmjTG',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-43a3-7760-9648-05a5b961b1a0',
        createdAt: {
          $date: '2025-05-19T18:41:57.667Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:57.667Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b76db08d000781a7dfe',
        },
        email: 'asdasfafs40@asdasfafsf.com',
        password:
          '$2b$10$lKWJNEyMlc2n7Y4KwEoRsuKJpYhshHEMMeDxrfc1Qj3ADifTC6hTG',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-4739-717f-83c1-39490d24d1e4',
        createdAt: {
          $date: '2025-05-19T18:41:58.585Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:58.585Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b77db08d000781a7e01',
        },
        email: 'asdasfafs41@asdasfafsf.com',
        password:
          '$2b$10$tY47tnBxwRWW27inw/ZZaerHzPiRjnNplM47jzxgSs087ZG3opB36',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-4a05-76c6-9849-9acaf04bb8ed',
        createdAt: {
          $date: '2025-05-19T18:41:59.301Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:59.301Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b77db08d000781a7e04',
        },
        email: 'asdasfafs42@asdasfafsf.com',
        password:
          '$2b$10$tNvwUjz3UFfoyafRctcqT.FSV5U.urOkIKvBXn.Uoy1P6SEXmwW.O',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-4cbb-768a-a376-ec1219b23ffd',
        createdAt: {
          $date: '2025-05-19T18:41:59.995Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:41:59.995Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b78db08d000781a7e07',
        },
        email: 'asdasfafs43@asdasfafsf.com',
        password:
          '$2b$10$fIfhc0xJl7wZO0ZB3f3IRO2i6uDionj0Ynz7WaoIgDw9Urofydy8m',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-4f6b-722b-a770-404dfd46722c',
        createdAt: {
          $date: '2025-05-19T18:42:00.683Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:00.683Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b79db08d000781a7e0a',
        },
        email: 'asdasfafs44@asdasfafsf.com',
        password:
          '$2b$10$bb84ugjMavYB2KmpzoeNGenc2tDOrjCEzIofDtWD.0.R//c3Td1ty',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-5263-76a2-8f3b-221e175e9edf',
        createdAt: {
          $date: '2025-05-19T18:42:01.443Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:01.443Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b7adb08d000781a7e0d',
        },
        email: 'asdasfafs45@asdasfafsf.com',
        password:
          '$2b$10$lhjpCfEZ1WSnfEW6ezlQ9uOr7IFCDsCXmFIt8iief4RKtP6RE/8x6',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-555a-7809-ad78-7c90feac5b79',
        createdAt: {
          $date: '2025-05-19T18:42:02.202Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:02.202Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b7bdb08d000781a7e10',
        },
        email: 'asdasfafs46@asdasfafsf.com',
        password:
          '$2b$10$D7ZSdC313RFVL5JldCas2OuH9Yj250jTx7GcUCg8FOqKUHXfyzdPi',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-59a0-7035-8b8f-5036bf7f04fb',
        createdAt: {
          $date: '2025-05-19T18:42:03.296Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:03.296Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b7cdb08d000781a7e13',
        },
        email: 'asdasfafs47@asdasfafsf.com',
        password:
          '$2b$10$rzcKNKlVaMg5aUJBED.Epee.bgcHVwXiFgyLC8rqFq3MBS0M/5IVG',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-5ec6-7224-a06f-91fc95d528f3',
        createdAt: {
          $date: '2025-05-19T18:42:04.614Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:04.614Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b7ddb08d000781a7e16',
        },
        email: 'asdasfafs48@asdasfafsf.com',
        password:
          '$2b$10$HDftG62jtkw9rmxYb1okIeshfOWBga2rD2yQQN5HkONjiGJkVMhIS',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-615b-7e3e-9640-7ef2f1bd2a49',
        createdAt: {
          $date: '2025-05-19T18:42:05.275Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:05.275Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b7ddb08d000781a7e19',
        },
        email: 'asdasfafs49@asdasfafsf.com',
        password:
          '$2b$10$3mkN6g8cFD2NYbPGwtwzM.Q8rzvvU4WBTxEBSvR5cGZnAkwgXNnkK',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-63d8-7cf9-84da-42d007360e3d',
        createdAt: {
          $date: '2025-05-19T18:42:05.912Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:05.912Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b7b7edb08d000781a7e1c',
        },
        email: 'asdasfafs50@asdasfafsf.com',
        password:
          '$2b$10$RxWJIQ6sQo0HXAKnCJqmGOGHXxT8lcZ0yIGFdooc6v2/6Vb0Kjouq',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196e9da-6765-7f39-a9fc-2a21e3d86e22',
        createdAt: {
          $date: '2025-05-19T18:42:06.821Z',
        },
        updatedAt: {
          $date: '2025-05-19T18:42:06.821Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b8de1fe50c230e1233a46',
        },
        email: 'asdasfafs51@asdasfafsf.com',
        password:
          '$2b$10$UoHPD/hnafw5LcBsI5rR1.4FsYOQ5n5uhA8GjKuaB8W40O39vkJy2',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196ea22-3877-7e81-b809-189348135eba',
        createdAt: {
          $date: '2025-05-19T20:00:33.399Z',
        },
        updatedAt: {
          $date: '2025-05-19T20:00:33.399Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b8de2fe50c230e1233a49',
        },
        email: 'asdasfafs52@asdasfafsf.com',
        password:
          '$2b$10$pDC9FgTIV5vRJgY4qfr5QOSgVDoE75MDc4/2ka96KFI4Ld27uxcw2',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196ea22-3e3c-7d6f-b5af-06526b74ef64',
        createdAt: {
          $date: '2025-05-19T20:00:34.876Z',
        },
        updatedAt: {
          $date: '2025-05-19T20:00:34.876Z',
        },
        __v: 0,
      },
      {
        _id: {
          $oid: '682b8dfafe50c230e1233a4d',
        },
        email: 'asdasfafs53@asdasfafsf.com',
        password:
          '$2b$10$lN3wCtdblLWLLTSCrv7oL.lKUbPCzN.kPvulZ5PyuYnWvaVgx9N6u',
        roles: ['USER'],
        state: 'ACTIVE',
        uuid: '0196ea22-9b10-7134-9406-5a58680b538b',
        createdAt: {
          $date: '2025-05-19T20:00:58.640Z',
        },
        updatedAt: {
          $date: '2025-05-19T20:00:58.640Z',
        },
        __v: 0,
      },
    ];

    const newUsers = users.map((user) => {
      return {
        ...user,
        _id: ObjectId(user._id.$oid),
        createdAt: new Date(user.createdAt.$date),
        updatedAt: new Date(user.updatedAt.$date),
      };
    });

    dbInstance.users.insertMany(newUsers);
    dbInstance.events.insertMany(events);
    console.log('aaaaaaa');
  } catch (e) {
    console.log('bbbbbb');
    console.log(e);
  }
}

init();
