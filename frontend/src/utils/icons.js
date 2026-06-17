// utils/icons.js
// Icônes centralisées — réutilisables sur tout le site
// Une seule source de vérité pour chaque concept visuel

import { IoPerson } from 'react-icons/io5'
import { IoIosPin } from 'react-icons/io'
import { FiClock } from 'react-icons/fi'
import { BiCoinStack } from 'react-icons/bi'
import { GiFrance } from 'react-icons/gi'
import { FaPlaneDeparture, FaHandHoldingHeart, FaEnvelope, FaYoutube, FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaCreditCard, FaFileContract, FaBook, FaFileAlt, FaRegCheckCircle, FaRegTimesCircle, FaLeaf, FaGlobeAmericas, FaHeart, FaUsers} from 'react-icons/fa'

// Icônes génériques — utilisées sur tout le site
export const IconPerson = IoPerson       // âge, profil
export const IconClock = FiClock         // durée, temps
export const IconPin = IoIosPin          // lieu, pays, destination
export const IconMoney = BiCoinStack     // indemnité, prix

// Icônes Service civique
export const IconFrance = GiFrance           // mission en France
export const IconAbroad = FaPlaneDeparture   // mission à l'étranger
export const IconGrow = FaHandHoldingHeart   // grandir, s'engager

// Icones Footer
export const IconMail = FaEnvelope
export const IconYoutube = FaYoutube
export const IconLinkedin = FaLinkedin
export const IconInstagram = FaInstagram
export const IconFacebook = FaFacebook

// Icônes Comment partir — page détail mission
export const IconFlight = FaPlaneDeparture   // déjà importé
export const IconContact = FaEnvelope        // déjà importé
export const IconBooking = FaMapMarkerAlt    // réserver la mission
export const IconPayment = FaCreditCard      // payer
export const IconContract = FaFileContract  // signer la convention
export const IconGuide = FaBook             // conseils pratiques
export const IconFileMission = FaFileAlt    // fiche mission

// Icônes Inclus / non inclus - page détail mission
export const IconCheck = FaRegCheckCircle
export const IconTimes = FaRegTimesCircle

// Icônes soutenir
export const IconLeaf = FaLeaf
export const IconGlobe = FaGlobeAmericas
export const IconHeart = FaHeart
export const IconPeople = FaUsers