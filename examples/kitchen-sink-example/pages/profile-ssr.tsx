import React from 'react';
import { UserProfile, withPageAuthRequired } from '@zeushq/nextjs-zidentity';

import Layout from '../components/Layout';

type ProfileProps = { user: UserProfile };

export default function Profile({ user }: ProfileProps): React.ReactElement {
  return (
    <Layout>
      <h1>Profile</h1>

      <div>
        <h4>Profile (server rendered)</h4>
        <pre data-testid="profile">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
