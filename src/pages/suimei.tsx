import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { Query, queryToFormValues, formValuesToQuery } from '../lib/params'

export type OptionalQuery = Query

const SuimeiPage: NextPage = () => {
  const router = useRouter()

  return (
    <div className="suimei">
      <div
        className="tw-min-h-screen tw-pb-8 tw-flex tw-flex-col tw-justify-between tw-items-center tw-space-y-4"
        style={{ fontFamily: 'Serif' }}
      >
        <Header />
        <div className="tw-w-full tw-max-w-screen-md tw-px-4 tw-mx-auto tw-space-y-8">
          <div className="tw-text-center tw-text-7xl sm:tw-text-10xl">四柱推命</div>
          <table>
            <tr>
              <th></th>
              <th>時柱</th>
              <th>日柱</th>
              <th>月柱</th>
              <th>年柱</th>
            </tr>
            {['天干', '地支'].map((kanshi, i) => (
              <tr key={i}>
                <td>{kanshi}</td>
                <td>foo</td>
                <td>bar</td>
                <td>baz</td>
                <td>qux</td>
              </tr>
            ))}
          </table>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default SuimeiPage
