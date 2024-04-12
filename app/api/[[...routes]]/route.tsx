/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as hub_neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { addMinted, addUser, incrementUserTotalLoads, verifyInstall, verifyMint, verifyAward } from '../../core/addUserNotify'

type State = {
  saved: boolean
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
        const isAwarded = await verifyAward(frameData?.fid || 0);
        if (!totalLoads) {
          addUser(userData)
        } else if (isAwarded) {
          const url = `${process.env.NEXT_PUBLIC_HOST}/api/awarded?fid=${frameData?.fid}&lxp=${isAwarded}`

          // quest completed
          return c.res({
            action: '/',
            image: url,
            imageAspectRatio: '1:1',
            intents: [
              <Button.Link href="https://snaps.metamask.io/">Explore MetaMask Snaps</Button.Link>,
            ],
          })
        }
        deriveState(previousState => {
          previousState.saved = true
        })
      }
    }
    const url = `${process.env.NEXT_PUBLIC_HOST}?fid=${frameData?.fid}`

    //Install Snap
    return c.res({
      action: '/',
      image: `/images/install.png`,
      imageAspectRatio: '1:1',
      intents: [
        <Button.Link href={url}>1. Install Snap</Button.Link>,
        <Button value="Third">2. Verify Install</Button>,
      ],
    })
  }
  if (buttonValue === 'Third') {
    const isInstalled = await verifyInstall(frameData?.fid || 0);
    if (isInstalled) {

      //Mint
      return c.res({
        action: '/',
        image: `/images/mint.jpg`,
        imageAspectRatio: '1:1',
        intents: [
          <Button value="Fourth">3. Mint with Phosphor on Linea</Button>,
        ],
      })
    } else {
      const url = `${process.env.NEXT_PUBLIC_HOST}?fid=${frameData?.fid}`

      //Didnt Install
      return c.res({
        action: '/',
        image: `/images/didntinstall.png`,
        imageAspectRatio: '1:1',
        intents: [
          <Button.Link href={url}>1. Install Snap</Button.Link>,
          <Button value="Third">2. Verify Install</Button>,
        ],
      })
    }

  }
  if (buttonValue === 'Fourth') {
    /* const response = await fetch('https://public-api.phosphor.xyz/v1/purchase-intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      body: JSON.stringify({
        "listing_id": `${process.env.LISTING}`,
        //"d7a21dd1-c01b-4ff3-8814-3cfd3ba4b8f2",
        "quantity": 1,
        "provider": "ORGANIZATION",
        "buyer": {
          //"eth_address": "0xdb16183970248043ce555689150253d89c14401c"
          "eth_address": c.var.interactor?.verifiedAddresses.ethAddresses[0]
        },
      })
    });

    const data = await response.json();
    console.log('phosphor', data);
    if (!data.data) {
      console.log(data.error.status);
      if (data.error.status == '422') {
        if (data.error.detail == 'Current policy max_per_user limit: 2 exceeds limit 1') {
          const url = `${process.env.NEXT_PUBLIC_HOST}/api/minted?status=alreadyminted`

          //already minted
          return c.res({
            action: '/',
            image: url,
            imageAspectRatio: '1:1',
            intents: [
              <Button.Link href="https://snaps.metamask.io/">Explore MetaMask Snaps</Button.Link>,
            ],
          })
        } else {
          const url = `${process.env.NEXT_PUBLIC_HOST}/api/minted?status=mintover`

          //mint over
          return c.res({
            action: '/',
            image: url,
            imageAspectRatio: '1:1',
            intents: [
              <Button.Link href="https://snaps.metamask.io/">Explore MetaMask Snaps</Button.Link>,
            ],
          })
        }
      } else if (data.error.status == '409') {
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/minted?status=mintover`

        //mint over
        return c.res({
          action: '/',
          image: url,
          imageAspectRatio: '1:1',
          intents: [
            <Button.Link href="https://snaps.metamask.io/">Explore MetaMask Snaps</Button.Link>,
          ],
        })
      } else {
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/minted?status=error`

        //error
        return c.res({
          action: '/',
          image: url,
          imageAspectRatio: '1:1',
          intents: [
            <Button.Link href="https://snaps.metamask.io/">Explore MetaMask Snaps</Button.Link>,
          ],
        })
      }

    } else {
      await addMinted(frameData?.fid || 0);
      const url = `https://lineascan.build/address/${c.var.interactor?.verifiedAddresses.ethAddresses[0]}#tokentxnsErc1155`
      const urlminted = `${process.env.NEXT_PUBLIC_HOST}/api/minted?address=${c.var.interactor?.verifiedAddresses.ethAddresses[0]}&status=minted`

      //success
      return c.res({
        action: '/',
        image: urlminted,
        imageAspectRatio: '1:1',
        intents: [
          <Button value="Fifth">Open Mystery Box</Button>,
        ],
      })
    } */
    await addMinted(frameData?.fid || 0);
    const urlminted = `${process.env.NEXT_PUBLIC_HOST}/api/minted?address=${c.var.interactor?.verifiedAddresses.ethAddresses[0]}&status=minted`

    //success
    return c.res({
      action: '/',
      image: urlminted,
      imageAspectRatio: '1:1',
      intents: [
        <Button value="Fifth">Open Mystery Box</Button>,
      ],
    })
  }
  if (buttonValue === 'Fifth') {
    const isMinted = await verifyMint(frameData?.fid || 0);

    if (isMinted) {
      const numbersArray = [50, 50, 50, 50, 50, 50, 250, 250, 500];
      const selectRandomNumber = (numbers: number[]): number => {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        return numbers[randomIndex];
      };
      const randomNumber = selectRandomNumber(numbersArray);
      console.log("randomNumber", randomNumber);
      const url = `${process.env.NEXT_PUBLIC_HOST}/api/award?fid=${frameData?.fid}&lxp=${randomNumber}`

      //mystery box
      return c.res({
        action: '/',
        image: url,
        imageAspectRatio: '1:1',
        intents: [
          <Button.Link href="https://snaps.metamask.io/">Explore MetaMask Snaps</Button.Link>,
        ],
      })
    } else {
      const url = `${process.env.NEXT_PUBLIC_HOST}/api/minted?status=notmintedyet`

      //Mint retry
      return c.res({
        action: '/',
        image: url,
        imageAspectRatio: '1:1',
        intents: [
          <Button value="Fourth">3. Mint with Phosphor on Linea</Button>,
        ],
      })
    }
  }

  //First frame
  return c.res({
    action: '/',
    image: `/images/start.png`,
    imageAspectRatio: '1:1',
    intents: [
      <Button value="Second">Start</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
