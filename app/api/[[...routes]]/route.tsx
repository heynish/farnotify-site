/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as hub_neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { addUser, incrementUserTotalLoads } from '../../core/addUserPortfolio'

type State = {
  saved: boolean
}

interface UserData {
  fid: number;
  following: boolean;
  recasted: boolean;
}

const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/api',
  initialState: {
    saved: false
  },
  hub: hub_neynar({ apiKey: 'EC2DCE21-B728-41DF-8932-5B061E75C47F' }),

})

  .use(
    neynar({
      apiKey: 'EC2DCE21-B728-41DF-8932-5B061E75C47F',
      features: ['interactor', 'cast'],
    }),
  )

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  const { buttonValue, deriveState } = c
  const { frameData, verified } = c
  if (buttonValue === 'Second') {
    const state = deriveState()
    console.log('Second');
    console.log(state);
    if (!state.saved) {
      if (verified) {
        console.log('Is verified');
        //save to db
        const username = c.var.interactor?.username
        const address = c.var.interactor?.verifiedAddresses.ethAddresses[0]
        const following = c.var.interactor?.viewerContext?.following
        const userData = {
          username: username || '',
          fid: frameData?.fid || 0,
          address: address || '',
          loads: 1,
          following: following || false,
          recasted: false,
        };

        const totalLoads = await incrementUserTotalLoads(frameData?.fid || 0);
        if (!totalLoads) addUser(userData)


        deriveState(previousState => {
          previousState.saved = true
        })
      }
    }
    return c.res({
      action: '/',
      image: `/images/2.png`,
      imageAspectRatio: '1:1',
      intents: [
        <Button value="First">Prev</Button>,
        <Button value="Third">Next</Button>,
      ],
    })
  }
  if (buttonValue === 'Third') {
    return c.res({
      action: '/',
      image: `/images/3.png`,
      imageAspectRatio: '1:1',
      intents: [
        <Button value="Second">Prev</Button>,
        <Button value="Fourth">Next</Button>,
      ],
    })
  }
  if (buttonValue === 'Fourth') {
    return c.res({
      action: '/',
      image: `/images/4.png`,
      imageAspectRatio: '1:1',
      intents: [
        <Button value="Third">Prev</Button>,
        <Button value="Fifth">Next</Button>,
      ],
    })
  }
  if (buttonValue === 'Fifth') {
    return c.res({
      action: '/',
      image: `/images/5.png`,
      imageAspectRatio: '1:1',
      intents: [
        <Button value="Fourth">Prev</Button>,
        <Button.Link href="https://portfolio.metamask.io/">MetaMask Portfolio</Button.Link>,
      ],
    })
  }
  return c.res({
    action: '/',
    image: `/images/1.png`,
    imageAspectRatio: '1:1',
    intents: [
      <Button value="Second">Next</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
