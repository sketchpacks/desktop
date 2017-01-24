import React from 'react'
const {PropTypes} = React

const ICONS = {
  'versions': 'M13,3 L7,3 C6.45,3 6,3.45 6,4 L6,12 C6,12.55 6.45,13 7,13 L13,13 C13.55,13 14,12.55 14,12 L14,4 C14,3.45 13.55,3 13,3 L13,3 Z M12,11 L8,11 L8,5 L12,5 L12,11 L12,11 Z M4,4 L5,4 L5,5 L4,5 L4,11 L5,11 L5,12 L4,12 C3.45,12 3,11.55 3,11 L3,5 C3,4.45 3.45,4 4,4 L4,4 Z M1,5 L2,5 L2,6 L1,6 L1,10 L2,10 L2,11 L1,11 C0.45,11 0,10.55 0,10 L0,6 C0,5.45 0.45,5 1,5 L1,5 Z',
  'watchers': '',
  'stargazers': '14 6 9.1 5.36 7 1 4.9 5.36 0 6 3.6 9.26 2.67 14 7 11.67 11.33 14 10.4 9.26',
  'compatible_version': 'M16,8.5 L10,14.5 L7,11.5 L8.5,10 L10,11.5 L14.5,7 L16,8.5 L16,8.5 Z M5.7,12.2 L6.5,13 L2,13 C1.45,13 1,12.55 1,12 L1,3 C1,2.45 1.45,2 2,2 L9,2 C9.55,2 10,2.45 10,3 L10,9.5 L9.2,8.7 C8.81,8.31 8.17,8.31 7.78,8.7 L5.7,10.8 C5.31,11.19 5.31,11.82 5.7,12.21 L5.7,12.2 Z M4,4 L9,4 L9,3 L4,3 L4,4 L4,4 Z M4,6 L9,6 L9,5 L4,5 L4,6 L4,6 Z M4,8 L7,8 L7,7 L4,7 L4,8 L4,8 Z M3,9 L2,9 L2,10 L3,10 L3,9 L3,9 Z M3,7 L2,7 L2,8 L3,8 L3,7 L3,7 Z M3,5 L2,5 L2,6 L3,6 L3,5 L3,5 Z M3,3 L2,3 L2,4 L3,4 L3,3 L3,3 Z',
  'autoupdates': '10 7 6 7 9 0 0 9 4 9 1 16',
  'github': 'M8,0 C3.58,0 0,3.58 0,8 C0,11.54 2.29,14.53 5.47,15.59 C5.87,15.66 6.02,15.42 6.02,15.21 C6.02,15.02 6.01,14.39 6.01,13.72 C4,14.09 3.48,13.23 3.32,12.78 C3.23,12.55 2.84,11.84 2.5,11.65 C2.22,11.5 1.82,11.13 2.49,11.12 C3.12,11.11 3.57,11.7 3.72,11.94 C4.44,13.15 5.59,12.81 6.05,12.6 C6.12,12.08 6.33,11.73 6.56,11.53 C4.78,11.33 2.92,10.64 2.92,7.58 C2.92,6.71 3.23,5.99 3.74,5.43 C3.66,5.23 3.38,4.41 3.82,3.31 C3.82,3.31 4.49,3.1 6.02,4.13 C6.66,3.95 7.34,3.86 8.02,3.86 C8.7,3.86 9.38,3.95 10.02,4.13 C11.55,3.09 12.22,3.31 12.22,3.31 C12.66,4.41 12.38,5.23 12.3,5.43 C12.81,5.99 13.12,6.7 13.12,7.58 C13.12,10.65 11.25,11.33 9.47,11.53 C9.76,11.78 10.01,12.26 10.01,13.01 C10.01,14.08 10,14.94 10,15.21 C10,15.42 10.15,15.67 10.55,15.59 C13.71,14.53 16,11.53 16,8 C16,3.58 12.42,0 8,0 L8,0 Z',
  'arrow_down': 'M7 10l5 5 5-5z',
  'brand': 'M14,5.99969994 L4,15.9947267 L24.003,42 L44,15.9957269 L44,15.9937265 L34.001,6.00670136 L14,5.99969994 Z M8.026,15.9797237 L15.014,8.99030637 L33.006,8.99030637 L40.006,15.9827243 L24.014,36.9959853 L8.026,15.9797237 Z',
}

const SVGIcon = props => {
  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'text-bottom',
    },
    path: {
      fill: props.color,
    },
  }

  const renderSVG = (shape, data) => {
    switch (shape) {
      case 'path':
        return (<path style={styles.path} d={ICONS[props.icon]} ></path>)
      case 'polygon':
        return (<polygon style={styles.path} points={ICONS[props.icon]} ></polygon>)
    }
  }

  return (
    <svg
      style={styles.svg}
      width={`${props.size}`}
      height={`${props.size}`}
      viewBox={`${props.viewBox}`}
    >
      { renderSVG(props.shape, ICONS[props.icon]) }
    </svg>
  )
}

SVGIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
  viewBox: PropTypes.string,
};

SVGIcon.defaultProps = {
  size: '1em',
  shape: 'path',
  viewBox: "0 0 18 18",
};

export default SVGIcon