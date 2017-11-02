import React from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';

/* global process */

const Link = ({ file, name, region }) =>
  file[region] ? (
    <a
      href={`${process.env.REACT_APP_DB_SITE}${region}/${name}/${file[region]
        .version}/${name}.${file[region].isLocalizedText ? 'txt' : 'json'}`}
      target="_blank"
    >
      {'here'}
    </a>
  ) : (
    <span>&nbsp;</span>
  );
Link.propTypes = {
  file: React.PropTypes.array.isRequired,
  name: React.PropTypes.string.isRequired,
  region: React.PropTypes.string.isRequired
};

const Files = inject('files')(
  observer(({ files, filter }) => (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>GL</th>
          <th>JA</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(files.files || {}).map(
          (f, i) =>
            f.toUpperCase().match(filter.toUpperCase()) ? (
              <tr key={i}>
                <td>{f}</td>
                <td>
                  <Link name={f} file={files.files[f]} region="global" />
                </td>
                <td>
                  <Link name={f} file={files.files[f]} region="ja" />
                </td>
              </tr>
            ) : null
        )}
      </tbody>
    </table>
  ))
);

@observer
export default class FilesView extends React.Component {
  @observable filter = '';

  @action handleChange = evt => (this.filter = evt.target.value);

  render() {
    return (
      <div>
        <label className="pt-label">
          {'Filter'}
          <input
            className="pt-input w200"
            onChange={this.handleChange}
            placeholder="Filter"
            type="text"
            value={this.filter}
          />
        </label>
        <Files filter={this.filter} />
      </div>
    );
  }
}
