const React = require('react');

module.exports = {
  ChevronRight: function ChevronRight(props) {
    return React.createElement('svg', { ...props, 'data-testid': 'chevron-right' }, 'ChevronRight');
  },
  Star: function Star(props) {
    return React.createElement('svg', { ...props, 'data-testid': 'star' }, 'Star');
  },
  Rocket: function Rocket(props) {
    return React.createElement('svg', { ...props, 'data-testid': 'rocket' }, 'Rocket');
  },
  Trophy: function Trophy(props) {
    return React.createElement('svg', { ...props, 'data-testid': 'trophy' }, 'Trophy');
  },
  Heart: function Heart(props) {
    return React.createElement('svg', { ...props, 'data-testid': 'heart' }, 'Heart');
  },
};
