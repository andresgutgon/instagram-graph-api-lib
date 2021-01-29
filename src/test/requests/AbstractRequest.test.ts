import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Constants } from '../../main/Constants';
import { AbstractRequest } from '../../main/requests/AbstractRequest';
import { TestConstants } from '../TestConstants';

describe('AbstractRequest', () => {
    class AbstractRequestImpl extends AbstractRequest<any> {
        protected parseResponse(response: AxiosResponse) {
            return response;
        }
        protected url(): string {
            return TestConstants.PATH;
        }

        constructor() {
            super(TestConstants.ACCESS_TOKEN);
        }
    }

    let request: AbstractRequestImpl = new AbstractRequestImpl();

    let mock = new MockAdapter(axios);
    mock.onAny().reply(200, TestConstants.FULL_MEDIA_DATA);

    it('Executes the request', () => {
        expect.assertions(2);
        return request.execute().then((response: AxiosResponse) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual(TestConstants.FULL_MEDIA_DATA);
        });
    });

    it('Builds a config', () => {
        expect(request.config()).toEqual({
            params: {
                access_token: TestConstants.ACCESS_TOKEN,
            },
            method: 'GET',
            url: TestConstants.PATH,
            baseURL: Constants.API_URL,
        });
    });

    it('Adds the paging', () => {
        request.addPaging(TestConstants.BEFORE_PAGE);
        expect(request.config().params.before).toEqual(TestConstants.BEFORE_PAGE.value);
        request.addPaging(TestConstants.AFTER_PAGE);
        expect(request.config().params.after).toEqual(TestConstants.AFTER_PAGE.value);

        // Test that it clears the previous paging
        expect(request.config().params.before).toBeUndefined();
        request.addPaging(TestConstants.BEFORE_PAGE);
        expect(request.config().params.after).toBeUndefined();
    });

    it('Adds the range', () => {
        request.addRange(TestConstants.SINCE, TestConstants.UNTIL);
        expect(request.config().params.since).toEqual(TestConstants.SINCE);
        expect(request.config().params.until).toEqual(TestConstants.UNTIL);
    });
});