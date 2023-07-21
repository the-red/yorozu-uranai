import { FC } from 'react'
import { FormProps, useYorozuUranaiForm } from '../../hooks/useYorozuUranaiForm'
import Link from 'next/link'
import { pagesPath } from '../../lib/$path'

export const SuimeiForm: FC<FormProps> = (props) => {
  const { register, hookFormHandleSubmit, watch, handleSubmit, isTimeUnknownChecked, zone, lat, lng } =
    useYorozuUranaiForm(props)

  return (
    <section onSubmit={hookFormHandleSubmit(handleSubmit)} className="information_input">
      <div className="inner">
        <h3>情報入力</h3>
        <form action="" method="post" id="">
          <dl>
            <dt>生年月日</dt>
            <dd className="date_time">
              <input type="date" {...register('date')} />
              <input type="time" {...register('time')} disabled={isTimeUnknownChecked} />
              <div>
                <span>{zone}</span>
                <span style={{ marginLeft: '12px' }}>
                  <input id="horoscope[time_unknown]" type="checkbox" {...register('timeUnknown')} />
                  <label htmlFor="horoscope[time_unknown]">時刻不明</label>
                </span>
              </div>
            </dd>
            <dt>出生場所</dt>
            <dd className="location">
              <div style={{ textDecoration: 'underline', marginBottom: '5px' }}>
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <Link href={pagesPath.map.$url({ query: { lat: lat, lng: lng } })} target="_blank" rel="opener">
                  地図から検索
                </Link>
              </div>
              <div className="lat">
                <label>
                  <span>緯度</span>
                  <input disabled type="text" {...register('lat', { valueAsNumber: true })} />
                </label>
              </div>
              <div className="lng">
                <label>
                  <span>経度</span>
                  <input disabled type="text" {...register('lng', { valueAsNumber: true })} />
                </label>
              </div>
              <div>{watch('address')}</div>
            </dd>
            <dt>性別</dt>
            <dd className="gender">
              <ul>
                <li>
                  <label>
                    <input {...register('gender', { required: true })} type="radio" value="man" />
                    <div>男性</div>
                  </label>
                </li>
                <li>
                  <label>
                    <input {...register('gender', { required: true })} type="radio" defaultChecked={true} />
                    <div>女性</div>
                  </label>
                </li>
              </ul>
            </dd>
          </dl>
          <div className="create_meisiki_button">
            <button type="submit">命式を作成する</button>
          </div>
        </form>
      </div>
    </section>
  )
}
