#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { FleetManagementStack } from '../lib/fleet-management-stack';

const app = new App();
new FleetManagementStack(app, 'FleetManagementStack');
