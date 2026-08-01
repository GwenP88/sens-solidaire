// utils/icons.js
// Icônes centralisées — réutilisables sur tout le site
// Une seule source de vérité pour chaque concept visuel

import { IoPerson } from 'react-icons/io5'
import { IoIosPin } from 'react-icons/io'
import { FiClock } from 'react-icons/fi'
import { BiCoinStack } from 'react-icons/bi'
import { GiFrance } from 'react-icons/gi'
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaPlaneDeparture, FaHandHoldingHeart, FaEnvelope, FaYoutube, FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaCreditCard, FaFileContract, FaBook, FaFileAlt, FaRegCheckCircle, FaRegTimesCircle, FaLeaf, FaGlobeAmericas, FaHeart, FaUsers, FaTiktok, FaRegBuilding } from 'react-icons/fa'
import { LuUserCheck, LuSend, LuFileSearch, LuMessagesSquare, LuHandshake, LuLuggage, LuRocket } from 'react-icons/lu'

// Icônes génériques — utilisées sur tout le site
export const IconPerson = IoPerson       // âge, profil
export const IconClock = FiClock         // durée, temps
export const IconPin = IoIosPin          // lieu, pays, destination
export const IconMoney = BiCoinStack     // indemnité, prix

// Icônes Mission
export const IconFrance = GiFrance           // mission en France
export const IconAbroad = FaPlaneDeparture   // mission à l'étranger
export const IconGrow = FaHandHoldingHeart   // grandir, s'engager
export const IconBuilding = FaRegBuilding    // corporate
export const IconHand = FaHandshakeSimple    // partenariat

// Icônes Inclus / non inclus - page détail mission
export const IconCheck = FaRegCheckCircle
export const IconTimes = FaRegTimesCircle

// Icones Footer
export const IconMail = FaEnvelope
export const IconYoutube = FaYoutube
export const IconLinkedin = FaLinkedin
export const IconInstagram = FaInstagram
export const IconFacebook = FaFacebook
export const IconTikTok = FaTiktok

// Icônes Comment partir — page détail mission
export const IconFlight = FaPlaneDeparture  
export const IconContact = FaEnvelope        
export const IconBooking = FaMapMarkerAlt 
export const IconPayment = FaCreditCard 
export const IconContract = FaFileContract 
export const IconGuide = FaBook 
export const IconFileMission = FaFileAlt 

// Icônes soutenir
export const IconLeaf = FaLeaf
export const IconGlobe = FaGlobeAmericas
export const IconHeart = FaHeart
export const IconPeople = FaUsers

// Icônes Procédure Service Civique — page détail Service Civique
export const IconEligibilite   = LuUserCheck
export const IconCandidature   = LuSend
export const IconEtudeDossier  = LuFileSearch
export const IconEntretien     = LuMessagesSquare
export const IconValidation    = LuHandshake
export const IconPreparation   = LuLuggage
export const IconDepart        = LuRocket