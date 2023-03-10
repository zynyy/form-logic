import { SchemeForm, getSubmitFormValues, useCreateForm } from '@formlogic/render';

import { Alert, Button, Checkbox, Col, Row } from 'antd';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import {
  getAutoLogin,
  getRememberPassword,
  getRememberUser,
  removeRememberUser,
  removeUseInfo,
  setRememberUser,
  setUserInfo,
} from '@/utils/storage';
import { uid } from '@formlogic/editor';

import UserInput from '@/components/user-input';

import './style/index.css';

const Login = () => {
  const [form] = useCreateForm();

  const navigate = useNavigate();

  const [autoLogin, setAutoLogin] = useState(() => getAutoLogin() ?? false);
  const [rememberPassword, setRememberPassword] = useState(() => getRememberPassword() ?? false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    getSubmitFormValues(form)
      .then((formValues) => {
        const { username, password } = formValues;

        if (!(username === '18020740000' && password === 'hyl123456')) {
          setVisible(true);
          return;
        }

        setUserInfo({
          token: uid(),
        });

        setAutoLogin(autoLogin);
        setRememberPassword(rememberPassword);

        if (rememberPassword) {
          setRememberUser({
            username,
            password,
          });
        } else {
          removeRememberUser();
        }

        navigate('/main');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleAutoLoginChange = (e) => {
    const { checked } = e.target;
    setAutoLogin(checked);
    if (!rememberPassword && checked) {
      setRememberPassword(true);
    }
  };

  const handleRememberPasswordChange = (e) => {
    const { checked } = e.target;

    if (!checked) {
      setAutoLogin(false);
    }
    setRememberPassword(checked);
  };

  const initialValues = useMemo(() => {
    return getRememberUser();
  }, []);

  useEffect(() => {
    removeUseInfo();
  }, []);

  return (
    <>
      <Helmet>
        <title>????????????</title>
      </Helmet>

      <div className="login-wrap">
        <div className="login">
          {visible ? (
            <Alert
              message="???????????????????????? 18020740000/hyl123456"
              type="error"
              closable
              afterClose={handleClose}
              showIcon
            />
          ) : null}

          <Row>
            <SchemeForm
              schema={{}}
              components={{
                UserInput,
              }}
              pattern="EDITABLE"
              form={form}
            />

            <Col className="btn">
              <Checkbox checked={autoLogin} onChange={handleAutoLoginChange}>
                ????????????
              </Checkbox>
              <Checkbox checked={rememberPassword} onChange={handleRememberPasswordChange}>
                ????????????
              </Checkbox>
              <Button type="link">????????????</Button>
            </Col>

            <Col span={24}>
              <Button type="primary" onClick={handleSubmit} className="submit">
                ??????
              </Button>
            </Col>
          </Row>

          {/*<div className="other">*/}
          {/*  ??????????????????*/}
          {/*  <AlipayCircleOutlined className="icon" />*/}
          {/*  <WeiboCircleOutlined className="icon" />*/}
          {/*  <QqOutlined className="icon" />*/}
          {/*  <WechatOutlined className="icon" />*/}
          {/*  <Link className="register" to="/login-class">*/}
          {/*    ??????class*/}
          {/*    /!* ???????????? *!/*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </div>
      </div>
    </>
  );
};

export default Login;
