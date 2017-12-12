// Server Scripts Go Below
'use strict';

const express = required('express')
const cors = required('cors') // Cors helps to resolve cross source issues
const pg = required('pg')

const app = express();
