import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, Divider, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGlobalContext } from 'shared/hooks/useGlobalContext';
import 'assets/styles/pageContainer.scss';
import { Helmet } from 'react-helmet';
import AuthControl from 'auth/authControl/AuthControl';

const PageContainer = forwardRef(
  (
    {
      children,
      content = true,
      contentSx = {},
      action,
      sx = {},
      title,
      backPath = '',
      allowedRoles = [],
      ...others
    }: any,
    ref
  ) => {
    const context = useGlobalContext();

    return (
      <AuthControl allowedRoles={allowedRoles}>
        <Card
          className={others.classnames ? others.classnames + ' PageContainer' : 'PageContainer'}
          ref={ref}
          elevation={0}
          sx={{ ...sx }}
          {...others}
        >
          {/* card header and action */}
          {title && (
            <CardHeader
              className="titleContainer"
              sx={{ '& .MuiCardHeader-action': { mr: 0 } }}
              title={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: -1,
                  }}
                >
                  <IconButton sx={{ marginRight: 1, width: '48px', height: '48px' }} onClick={() => context.onBack(backPath)}>
                    <ArrowBackIcon />
                  </IconButton>

                  <Typography variant="h1">{title}</Typography>
                </Box>
              }
              action={
                <Box mt="5px" mb="5px">
                  {action}
                </Box>
              }
            />
          )}

          {/* content & header divider */}
          {title && <Divider />}

          {/* card content */}
          {content && (
            <CardContent sx={contentSx} className="cardContainer">
              {children}
            </CardContent>
          )}

          {!content && children}

          {title && (
            <Helmet>
              <title>{title}</title>
            </Helmet>
          )}
        </Card>
      </AuthControl>
    );
  }
);

export default PageContainer;
