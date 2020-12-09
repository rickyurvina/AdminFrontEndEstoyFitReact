import React from 'react';
import List from '@material-ui/core/List';

import routesConfig from '../../../../modules/routesConfig';
import VerticalCollapse from './VerticalCollapse';
import VerticalItem from './VerticalItem';
import VerticalNavGroup from './VerticalNavGroup';
import {useAuthUser} from '../../../utility/AppHooks';

const Navigation = () => { 
  const user = useAuthUser();
  return (
    <List>
      {routesConfig.map((item) => ( 
        <React.Fragment key={item.id}>
          {(item.type === 'group' && item.role === user.role_id) && <VerticalNavGroup item={item} level={0} />}

          {(item.type === 'collapse' && item.role === user.role_id) && (
            <VerticalCollapse item={item} level={0} />
          )}

          {(item.type === 'item' && item.role === user.role_id ) && <VerticalItem item={item} level={0} />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default Navigation;
