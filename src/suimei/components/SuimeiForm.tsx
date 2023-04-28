export const SuimeiForm = () => (
  <section className="information_input">
    <div className="inner">
      <h3>情報入力</h3>
      <form action="" method="post" id="">
        <dl>
          <dt>生年月日</dt>
          <dd className="date_time">
            <input type="date" name="date" />
            <input type="time" name="time" />
          </dd>
          <dt>出生場所</dt>
          <dd className="longitude_latitude">
            <div className="longitude">
              <label>
                <span>緯度</span>
                <input type="text" name="longitude" value="35.604839" />
              </label>
            </div>
            <div className="latitude">
              <label>
                <span>経度</span>
                <input type="text" name="latitude" value="139.667717" />
              </label>
            </div>
          </dd>
          <dt>性別</dt>
          <dd className="gender">
            <ul>
              <li>
                <label>
                  <input type="radio" name="gender" value="未選択" checked />
                  <div>未選択</div>
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="gender" value="男性" />
                  <div>男性</div>
                </label>
              </li>
              <li>
                <label>
                  <input type="radio" name="gender" value="女性" />
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
