export const InviteAssetsMembersRequestDto = {
    json: {
        paths: {},
        servers: {},
        info: {},
        components: {
            schemas: {
                MembersEmailDto: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['members'],
                    properties: {
                        members: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/MemberEmailDto',
                            },
                        },
                    },
                },
                UserRole: {
                    type: 'string',
                    description: '',
                    'x-enumNames': ['Owner', 'Collaborator', 'Viewer'],
                    enum: ['Owner', 'Collaborator', 'Viewer'],
                },
                InviteMembersRequestDto: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/MembersEmailDto',
                        },
                        {
                            type: 'object',
                            additionalProperties: false,
                            required: ['role'],
                            properties: {
                                message: {
                                    type: 'string',
                                    maxLength: 5000,
                                    nullable: true,
                                },
                                role: {
                                    $ref: '#/components/schemas/UserRole',
                                },
                            },
                        },
                    ],
                },
                InviteAssetsMembersRequestDto: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/InviteMembersRequestDto',
                        },
                        {
                            type: 'object',
                            additionalProperties: false,
                            required: ['assetIds'],
                            properties: {
                                assetIds: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        format: 'guid',
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        },
    },
    expected: `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {MembersEmailDto, UserRole, InviteMembersRequestDto, InviteAssetsMembersRequestDto} from './pathToTypes';

export const aMembersEmailDtoAPI = (overrides?: Partial<MembersEmailDto>): MembersEmailDto => {
  return {
    members: overrides?.members || [aMemberEmailDtoAPI()],
  ...overrides,
  };
};

export const anInviteMembersRequestDtoAPI = (overrides?: Partial<InviteMembersRequestDto>): InviteMembersRequestDto => {
  return {
    message: 'message-invitemembersrequestdto',
  role: 'Owner',
  members: overrides?.members || [aMemberEmailDtoAPI()],
  ...overrides,
  };
};

export const anInviteAssetsMembersRequestDtoAPI = (overrides?: Partial<InviteAssetsMembersRequestDto>): InviteAssetsMembersRequestDto => {
  return {
    assetIds: ['officiis'],
  members: overrides?.members || [aMemberEmailDtoAPI()],
  message: 'message-inviteassetsmembersrequestdto',
  role: 'Owner',
  ...overrides,
  };
};
 
`,
};

export const MemberEmailDto = {
    json: {
        paths: {},
        servers: {},
        info: {},
        components: {
            schemas: {
                MemberEmailDto: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true
                        }
                    }
                },
            },
        },
    },
        expected: `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {MemberEmailDto} from './pathToTypes';

export const aMemberEmailDtoAPI = (overrides?: Partial<MemberEmailDto>): MemberEmailDto => {
  return {
    email: 'Destiney.Raynor@Charlie.biz',
  ...overrides,
  };
};
 
`

};

export const Comment = {
    json: {
        paths: {},
        servers: {},
        info: {},
        components: {
            schemas: {
                Comment: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        id: {
                            type: "string",
                            format: "guid"
                        },
                        message: {
                            type: "string",
                            nullable: true
                        },
                        userId: {
                            type: "string",
                            format: "guid"
                        },
                        annotationTime: {
                            type: "string",
                            format: "time-span",
                            nullable: true
                        },
                        annotationDuration: {
                            type: "string",
                            format: "time-span",
                            nullable: true
                        },
                        creationTime: {
                            type: "string",
                            format: "date-time"
                        },
                        lastModifiedTime: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
            },
        },
    },
    expected:`/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Comment} from './pathToTypes';

export const aCommentAPI = (overrides?: Partial<Comment>): Comment => {
  return {
    id: '6046ffb2-6bf2-4352-8bd1-399138ba33c0',
  message: 'message-comment',
  userId: '768bbcf6-0bde-4398-9859-3e2eb664e6f7',
  annotationTime: '2019-06-10T06:20:01.389Z',
  annotationDuration: '2019-06-10T06:20:01.389Z',
  creationTime: '2019-06-10T06:20:01.389Z',
  lastModifiedTime: '2019-06-10T06:20:01.389Z',
  ...overrides,
  };
};
 
`
}
