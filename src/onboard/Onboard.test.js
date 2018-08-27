import React from 'react';
import OnboardContainer from './Onboard.js';
import TestRenderer from 'react-test-renderer';
const api =  require('./api.js')

const submitEvent = Object.freeze({preventDefault: () => {}})


jest.mock('./api.js', () => ({
  postOnboardData: jest.fn(),
  __mockedData: 42
}));

jest.mock('./AdminForm.js', () => props => 
  <div componentType="AdminForm" {...props} />
);
jest.mock('./SMTPForm.js', () => props =>
  <div componentType="SMTPForm" {...props} />
);
jest.mock('./StorageForm.js', () => props =>
  <div componentType="StorageForm" {...props} />
);

const submitAdminData = (props, data) => {
  props.onInputChange({ 
    target: { name: "username", value: data.username } 
  })

  props.onInputChange({ 
    target: { name: "email", value: data.email } 
  })

  props.onInputChange({ 
    target: { name: "password", value: data.password } 
  })

  props.onSubmitButtonClick(submitEvent)
}

const submitSMTPData = (props, data) => {
  props.onInputChange({ 
    target: { name: "hostname", value: data.hostname } 
  })

  props.onInputChange({ 
    target: { name: "port", value: data.port } 
  })

  props.onInputChange({ 
    target: { name: "username", value: data.username } 
  })

  props.onInputChange({ 
    target: { name: "password", value: data.password } 
  })
  props.onSubmitButtonClick(submitEvent)
}

const submitNexcloudData = (props, data) => {
  props.onStorageOptionChange({ 
    target: { name: "storage", value: "nextcloud"  }
  })

  props.onNextcloudInputChange({ 
    target: { name: "url", value: data.url } 
  })

  props.onNextcloudInputChange({ 
    target: { name: "clientID", value: data.clientID } 
  })

  props.onNextcloudInputChange({ 
    target: { name: "secret", value: data.secret } 
  })

  props.onNextcloudInputChange({ 
    target: { name: "directory", value: data.directory } 
  })

  props.onNextcloudInputChange({ 
    target: { name: "joyreadURL", value: data.joyreadURL } 
  })
  props.onSubmitButtonClick(submitEvent)
}

describe('Minimal onboard process (No SMTP, Local Storage)', () => {
  describe('successful scenario', () => {
    let trees = [];
    const onOnboardComplete = jest.fn()
    

    beforeAll(() => {
      api.postOnboardData.mockReturnValueOnce(Promise.resolve({
        status: 200,
        body: "OK"
      }))

      const testRenderer = TestRenderer.create(
        <OnboardContainer onComplete={onOnboardComplete}/>
      );
      const initialTree = testRenderer.toJSON();
      trees.push(initialTree);

      submitAdminData(initialTree.props, {
        username: "tester",
        email: "tester@gmail.com",
        password: "secretpass"
      })

      const secondTree = testRenderer.toJSON();
      trees.push(secondTree);

      secondTree.props.onSkipButtonClick(submitEvent)

      const thirdTree = testRenderer.toJSON();
      trees.push(thirdTree);

      thirdTree.props.onStorageOptionChange({ target: { value: "local" } })
      thirdTree.props.onSubmitButtonClick(submitEvent)
    })

    it('starts with an AdminForm', () => {
      const [ initialTree ] = trees;

      expect(initialTree.props.componentType).toBe("AdminForm")
    })

    it('After submitting valid admin data, renders a SMTPForm', () => {
      const [ , secondTree ] = trees;

      expect(secondTree.props.componentType).toBe("SMTPForm")
    })

    it('After skipping SMTP config, renders a StorageForm', () => {
      const [ , ,thirdTree ] = trees;

      expect(thirdTree.props.componentType).toBe("StorageForm")
    })

    it('After submitting everything, should trigger the onSuccess callback', () => {
      expect(onOnboardComplete).toHaveBeenCalledWith("OK")
    })

  })

  describe('failiure scenario', () => {
    it('blocks the SMTP form if Admin data is not input correctly', () => {
      const testRenderer = TestRenderer.create(
        <OnboardContainer onComplete={jest.fn()}/>
      );
      const initialTree = testRenderer.toJSON();

      submitAdminData(initialTree.props, {
        username: "tester",
        email: "",
        password: "secretpass"
      });

      const failiureTree = testRenderer.toJSON();
      expect(failiureTree.props.componentType).toBe("AdminForm");
      expect(failiureTree.props.errors.email).not.toHaveLength(0)
    })
  })
})

describe('largest onboard process (SMTP, Nextcloud)', () => {
  describe('successful scenario', () => {
    let trees = [];
    const onOnboardComplete = jest.fn()
    

    beforeAll(() => {
      api.postOnboardData.mockReturnValueOnce(Promise.resolve({
        status: 200,
        body: "OK"
      }))

      const testRenderer = TestRenderer.create(
        <OnboardContainer onComplete={onOnboardComplete}/>
      );
      const initialTree = testRenderer.toJSON();
      trees.push(initialTree);

      submitAdminData(initialTree.props, {
        username: "tester",
        email: "tester@gmail.com",
        password: "secretpass"
      })

      const secondTree = testRenderer.toJSON();
      trees.push(secondTree);

      submitSMTPData(secondTree.props, {
        hostname: "mydomain.com",
        username: "noreply",
        port: "25",
        password: "secretpass"
      });

      const thirdTree = testRenderer.toJSON();
      trees.push(thirdTree);

      submitNexcloudData(thirdTree.props, {
        url: "mynextcloud.com",
        clientID: "myid",
        secret: "mysecret",
        directory: "/ebooks",
        joyreadURL: "myjoyread.com",
      });
    })

    it('starts with an AdminForm', () => {
      const [ initialTree ] = trees;

      expect(initialTree.props.componentType).toBe("AdminForm")
    })

    it('After submitting valid admin data, renders a SMTPForm', () => {
      const [ , secondTree ] = trees;

      expect(secondTree.props.componentType).toBe("SMTPForm")
    })

    it('After submitting valid SMTP config, renders a StorageForm', () => {
      const [ , ,thirdTree ] = trees;

      expect(thirdTree.props.componentType).toBe("StorageForm")
    })

    it('After submitting everything, should trigger the onSuccess callback', () => {
      expect(onOnboardComplete).toHaveBeenCalledWith("OK")
    })
  })

  describe('failiure scenario', () => {
    it('blocks the storage form if SMTP data is not input correctly', () => {
      const testRenderer = TestRenderer.create(
        <OnboardContainer onComplete={jest.fn()}/>
      );
      const initialTree = testRenderer.toJSON();

      submitAdminData(initialTree.props, {
        username: "tester",
        email: "tester@gmail.com",
        password: "secretpass"
      });
      submitSMTPData(testRenderer.toJSON().props, {
        hostname: "mydomain.com",
        username: "noreply",
        port: "",
        password: "secretpass"
      });

      const failiureTree = testRenderer.toJSON();
      expect(failiureTree.props.componentType).toBe("SMTPForm");
      expect(failiureTree.props.errors.port).not.toHaveLength(0)
    })

    it('does not trigger onComplete callback if storage data is not input correctly', () => {
      const onCompleteCallback = jest.fn();
      const testRenderer = TestRenderer.create(
        <OnboardContainer onComplete={onCompleteCallback}/>
      );
      const initialTree = testRenderer.toJSON();

      submitAdminData(initialTree.props, {
        username: "tester",
        email: "tester@gmail.com",
        password: "secretpass"
      });
      submitSMTPData(testRenderer.toJSON().props, {
        hostname: "mydomain.com",
        username: "noreply",
        port: "25",
        password: "secretpass"
      });
      submitNexcloudData(testRenderer.toJSON().props, {
        url: "mynextcloud.com",
        clientID: "myid",
        secret: "",
        directory: "/ebooks",
        joyreadURL: "myjoyread.com",
      });
    })
  })
})
