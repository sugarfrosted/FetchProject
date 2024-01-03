import axios from 'axios';


export function TestApi() {
    jest.mock('axios');

    // const mocked_axios = jest.mocked(axios);

    // beforeAll(() => { mocked_axios.create.mockReturnThis(); });


    // test('fuck', () => {
    //     mocked_axios.get.mockResolvedValue({ data: "fuck" });
    //     var instance = mocked_axios.create();
    //     // var butts = instance.request({
    //     //     method: 'get',
    //     //     url: '/dogs/breeds',
    //     // }) as any;
    //     // console.log(butts);
    //     return expect("fuck").toEqual("fuck");
    // });
}
