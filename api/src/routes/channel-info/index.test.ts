import { ChannelInfo, ChannelInfoDto } from '../../models/data/channel-info';
import { getChannelInfo, getChannelInfoDto, getChannelInfoFromBody, addChannelInfo, updateChannelInfo, deleteChannelInfo } from '.';
import * as ChannelInfoDb from '../../database/channel-info';
import moment from 'moment';

describe('test GET channelInfo', () => {
  let sendMock: any, sendStatusMock: any, nextMock: any, res: any;
  beforeEach(() => {
    sendMock = jest.fn();
    sendStatusMock = jest.fn();
    nextMock = jest.fn();

    res = {
      send: sendMock,
      sendStatus: sendStatusMock
    };
  });

  it('should return bad request if no address is given as parameter', async () => {
    const req: any = {
      params: {},
      body: null
    };

    await getChannelInfo(req, res, nextMock);
    expect(sendStatusMock).toHaveBeenCalledWith(400);
  });

  it('should return expected channel info', async () => {
    const channelInfo: ChannelInfo = {
      created: moment('09-02-2021', 'DD-MM-YYYY').toDate(),
      author: 'test-author2',
      subscribers: [],
      topics: [
        {
          source: 'test',
          type: 'test-type'
        }
      ],
      latestMessage: null,
      channelAddress: 'test-address3'
    };
    const getChannelInfoSpy = spyOn(ChannelInfoDb, 'getChannelInfo').and.returnValue(channelInfo);
    const req: any = {
      params: { channelAddress: 'test-address' },
      body: null
    };

    await getChannelInfo(req, res, nextMock);

    expect(getChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      author: 'test-author2',
      channelAddress: 'test-address3',
      created: '09-02-2021',
      latestMessage: null,
      subscribers: [],
      topics: [{ source: 'test', type: 'test-type' }]
    });
  });

  it('should call next(err) if an error occurs', async () => {
    const getChannelInfoSpy = spyOn(ChannelInfoDb, 'getChannelInfo').and.callFake(() => {
      throw new Error('Test error');
    });
    const req: any = {
      params: { channelAddress: 'test-address' },
      body: null
    };

    await getChannelInfo(req, res, nextMock);

    expect(getChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(new Error('Test error'));
  });
});

describe('test POST channelInfo', () => {
  let sendMock: any, sendStatusMock: any, nextMock: any, res: any;
  const validBody: ChannelInfoDto = {
    author: 'test-author2',
    channelAddress: 'test-address3',
    created: '02-09-2021',
    latestMessage: null,
    subscribers: [],
    topics: [{ source: 'test', type: 'test-type' }]
  };

  beforeEach(() => {
    sendMock = jest.fn();
    sendStatusMock = jest.fn();
    nextMock = jest.fn();

    res = {
      send: sendMock,
      sendStatus: sendStatusMock
    };
  });

  it('should return bad request if no valid body is given', async () => {
    const req: any = {
      params: {},
      body: null
    };
    await addChannelInfo(req, res, nextMock);
    expect(sendStatusMock).toHaveBeenCalledWith(400);
  });

  it('should return expected channel info', async () => {
    const addChannelInfoSpy = spyOn(ChannelInfoDb, 'addChannelInfo');

    const req: any = {
      params: {},
      body: validBody
    };

    await addChannelInfo(req, res, nextMock);

    expect(addChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendStatusMock).toHaveBeenCalledWith(201);
  });

  it('should call next(err) if an error occurs', async () => {
    const addChannelInfoSpy = spyOn(ChannelInfoDb, 'addChannelInfo').and.callFake(() => {
      throw new Error('Test error');
    });
    const req: any = {
      params: {},
      body: validBody
    };
    await addChannelInfo(req, res, nextMock);

    expect(addChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(new Error('Test error'));
  });
});

describe('test PUT channelInfo', () => {
  let sendMock: any, sendStatusMock: any, nextMock: any, res: any;
  const validBody: ChannelInfoDto = {
    author: 'test-author2',
    channelAddress: 'test-address3',
    created: '02-09-2021',
    latestMessage: null,
    subscribers: [],
    topics: [{ source: 'test', type: 'test-type' }]
  };

  beforeEach(() => {
    sendMock = jest.fn();
    sendStatusMock = jest.fn();
    nextMock = jest.fn();

    res = {
      send: sendMock,
      sendStatus: sendStatusMock
    };
  });

  it('should return bad request if no valid body is given', async () => {
    const req: any = {
      params: {},
      body: null
    };
    await updateChannelInfo(req, res, nextMock);
    expect(sendStatusMock).toHaveBeenCalledWith(400);
  });

  it('should return expected channel info', async () => {
    const updateChannelInfoSpy = spyOn(ChannelInfoDb, 'updateChannelInfo');

    const req: any = {
      params: {},
      body: validBody
    };

    await updateChannelInfo(req, res, nextMock);

    expect(updateChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendStatusMock).toHaveBeenCalledWith(200);
  });

  it('should call next(err) if an error occurs', async () => {
    const updateChannelInfoSpy = spyOn(ChannelInfoDb, 'updateChannelInfo').and.callFake(() => {
      throw new Error('Test error');
    });
    const req: any = {
      params: {},
      body: validBody
    };
    await updateChannelInfo(req, res, nextMock);

    expect(updateChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(new Error('Test error'));
  });
});

describe('test DELETE channelInfo', () => {
  let sendMock: any, sendStatusMock: any, nextMock: any, res: any;

  beforeEach(() => {
    sendMock = jest.fn();
    sendStatusMock = jest.fn();
    nextMock = jest.fn();

    res = {
      send: sendMock,
      sendStatus: sendStatusMock
    };
  });

  it('should return bad request if no address is given as parameter', async () => {
    const req: any = {
      params: {},
      body: null
    };
    await deleteChannelInfo(req, res, nextMock);
    expect(sendStatusMock).toHaveBeenCalledWith(400);
  });

  it('should return expected channel info', async () => {
    const deleteChannelInfoSpy = spyOn(ChannelInfoDb, 'deleteChannelInfo');

    const req: any = {
      params: { channelAddress: 'test-address' },
      body: null
    };

    await deleteChannelInfo(req, res, nextMock);

    expect(deleteChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendStatusMock).toHaveBeenCalledWith(200);
  });

  it('should call next(err) if an error occurs', async () => {
    const deleteChannelInfoSpy = spyOn(ChannelInfoDb, 'deleteChannelInfo').and.callFake(() => {
      throw new Error('Test error');
    });
    const req: any = {
      params: { channelAddress: 'test-address' },
      body: null
    };
    await deleteChannelInfo(req, res, nextMock);

    expect(deleteChannelInfoSpy).toHaveBeenCalledTimes(1);
    expect(sendMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(new Error('Test error'));
  });
});

describe('test getChannelInfoFromBody', () => {
  it('should not return null for valid dto', () => {
    const validChannelInfoDto: ChannelInfoDto = {
      author: 'test-author',
      topics: [{ source: 'test', type: 'test-type' }],
      channelAddress: 'test-address'
    };
    const result = getChannelInfoFromBody(validChannelInfoDto);

    expect(result).not.toBeNull();
    expect(result.channelAddress).toEqual('test-address');
    expect(result.author).toEqual('test-author');
    expect(result.topics).toEqual([{ source: 'test', type: 'test-type' }]);
  });
  it('should return null for empty address', () => {
    const validChannelInfoDto: ChannelInfoDto = {
      author: 'test-author',
      topics: [{ source: 'test', type: 'test-type' }],
      channelAddress: ''
    };

    expect(getChannelInfoFromBody(validChannelInfoDto)).toBeNull();
  });
  it('should return null for author=null', () => {
    const validChannelInfoDto: ChannelInfoDto = {
      author: null,
      topics: [{ source: 'test', type: 'test-type' }],
      channelAddress: 'test-address'
    };

    expect(getChannelInfoFromBody(validChannelInfoDto)).toBeNull();
  });
  it('should return null for empty topics', () => {
    const validChannelInfoDto: ChannelInfoDto = {
      author: 'test-author',
      topics: [],
      channelAddress: 'test-address'
    };

    expect(getChannelInfoFromBody(validChannelInfoDto)).toBeNull();
  });
});

describe('test getChannelInfoDto', () => {
  it('should transform database object to transfer object', () => {
    const validChannelInfo: ChannelInfo = {
      created: new Date('Mon, 08 Feb 2021 16:22:53 GMT'),
      subscribers: [],
      latestMessage: new Date('Mon, 08 Feb 2021 16:22:53 GMT'),
      author: 'test-author',
      topics: [{ source: 'test', type: 'test-type' }],
      channelAddress: 'test-address'
    };
    const result = getChannelInfoDto(validChannelInfo);

    expect(result).not.toBeNull();
    expect(result.channelAddress).toEqual('test-address');
    expect(result.author).toEqual('test-author');
    expect(result.topics).toEqual([{ source: 'test', type: 'test-type' }]);
    expect(result.created).toEqual('08-02-2021');
    expect(result.latestMessage).toEqual('08-02-2021');
    expect(result.subscribers).toEqual([]);
  });
});